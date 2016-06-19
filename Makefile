CWD:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

check-env:
ifndef AWS_ACCESS_KEY
	$(error AWS_ACCESS_KEY is undefined)
endif
ifndef AWS_SECRET_KEY
	$(error AWS_SECRET_KEY is undefined)
endif
ifndef AWS_REGION
	$(error AWS_REGION is undefined)
endif
ifndef AWS_PRIVATE_KEY
	$(error AWS_PRIVATE_KEY is undefined)
endif

launch-infra: check-env
	docker run --rm -e AWS_ACCESS_KEY -e AWS_SECRET_KEY \
    				-e AWS_REGION -e AWS_PRIVATE_KEY=/key.pem \
    				-v ${AWS_PRIVATE_KEY}:/key.pem \
    				-v ${CWD}/terraform:/data \
    				uzyexe/terraform apply --input=false

terraform-to-ansible:
	docker run --rm -v $(CWD)/terraform:/terraform \
    				-v $(CWD)/ansible:/ansible \
    				xebiafrance/terraform2ansible

configure: check-env
	docker run --rm -it -e ANSIBLE_HOST_KEY_CHECKING=false \
    				-v ${CWD}/ansible:/ansible \
    				-v ${AWS_PRIVATE_KEY}:/key.pem \
    				xebiafrance/ansible ansible-playbook -v -i "inventory" --private-key="/key.pem" "site.yml"

provision: launch-infra terraform-to-ansible configure

