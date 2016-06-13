#!/bin/sh

function checkEnv(){
    [ -z $(eval echo \${$1}) ] && (
        echo $1 environnement variable is missing
        echo
        echo export $1=$2
    ) && exit 1;
}

function usage(){
    echo "Usage: provision.sh"
}
checkEnv AWS_ACCESS_KEY "change me"
checkEnv AWS_SECRET_KEY "change me"
checkEnv AWS_REGION "eu-west-1"
checkEnv AWS_PRIVATE_KEY "/path/to/the/private/key"

export ANSIBLE_HOST_KEY_CHECKING=false

CWD=$(pwd $(dirname $0))
set -x
cd $CWD/terraform
terraform apply --input=false && (
    chmod 600 $CWD/terraform/xke-ha-swarm.pem;
    node $CWD/tools/terraform2ansible.js $CWD/terraform/terraform.tfstate $CWD/inventory;
    ansible-playbook -i "$CWD/inventory" --private-key="$CWD/terraform/xke-ha-swarm.pem" "$CWD/ansible/site.yml"
)