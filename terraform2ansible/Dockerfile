FROM node

COPY terraform2ansible.js /terraform2ansible/terraform2ansible.js

WORKDIR /terraform2ansible

VOLUME /terraform
VOLUME /ansible

ENTRYPOINT ["node", "terraform2ansible.js"]
CMD ["/terraform/terraform.tfstate", "/ansible/inventory"]