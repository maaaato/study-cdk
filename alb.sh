CLUSTER_NAME="sample-cluster"
AWS_DEFAULT_REGION="ap-northeast-1"
VPC_ID="vpc-0beb8e2622ef3998d"

# oidc providerの作成及びeksclusterとの紐づけ
eksctl utils associate-iam-oidc-provider \
    --cluster $CLUSTER_NAME \
    --approve

# ALB Controller用のPolicy作成
curl -o iam-policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json
aws iam create-policy \
    --policy-name $CLUSTER_NAME-ALB-Policy \
    --policy-document file://iam-policy.json

IAM_ARN=$(aws iam list-policies --query 'Policies[?PolicyName==`'$CLUSTER_NAME'-ALB-Policy`].Arn' --output text)

# ALB Controller用のRole作成
ISSUER_URL=$(aws eks describe-cluster \
        --name $CLUSTER_NAME \
        --query cluster.identity.oidc.issuer \
        --output text)
ISSUER_HOSTPATH=$(echo $ISSUER_URL | cut -f 3- -d'/')
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
PROVIDER_ARN="arn:aws:iam::$ACCOUNT_ID:oidc-provider/$ISSUER_HOSTPATH"
cat > irp-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "$PROVIDER_ARN"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "${ISSUER_HOSTPATH}:sub": "system:serviceaccount:kube-system:aws-load-balancer-controller"
        }
      }
    }
  ]
}
EOF
ROLE_NAME=$CLUSTER_NAME-ALB-IAM-Role
aws iam create-role \
        --role-name $ROLE_NAME \
        --assume-role-policy-document file://irp-trust-policy.json

aws iam update-assume-role-policy \
        --role-name $ROLE_NAME \
        --policy-document file://irp-trust-policy.json
aws iam attach-role-policy \
        --role-name $ROLE_NAME \
        --policy-arn $IAM_ARN
ALB_ROLE_ARN=$(aws iam get-role \
        --role-name $ROLE_NAME \
        --query Role.Arn --output text)

# ALB Controller用のservice account作成
kubectl create sa aws-load-balancer-controller -n kube-system
kubectl annotate sa aws-load-balancer-controller eks.amazonaws.com/role-arn=$ALB_ROLE_ARN -n kube-system

# ALB Controller用にcert-managerを設定
kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v1.12.3/cert-manager.yaml
echo '[MESSAGE] wait for cert-manager...'
sleep 30

# ALB Controller用のManifestを持ってきて修正してapply
wget https://github.com/kubernetes-sigs/aws-load-balancer-controller/releases/download/v2.7.0/v2_7_0_full.yaml
gsed s/your-cluster-name/$CLUSTER_NAME/ v2_7_0_full.yaml > ALB_Controller_manifest.yaml
gsed -i -e "/ingress-class=alb$/a \            - --aws-region=$AWS_DEFAULT_REGION" ./ALB_Controller_manifest.yaml
gsed -i -e "/ingress-class=alb$/a \            - --aws-vpc-id=$VPC_ID" ./ALB_Controller_manifest.yaml
kubectl apply -f ALB_Controller_manifest.yaml
