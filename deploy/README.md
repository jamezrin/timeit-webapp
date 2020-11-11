# Deployment steps

This project uses Ansible and Docker for deploying the application.

## Ansible Playbooks

### Deploy

#### Deploying the frontend

```shell script
ansible-playbook deploy/deploy_frontend.yml --key-file=~/.ssh/aws-vps1.pem
```

#### Deploying the backend

```shell script
ansible-playbook deploy/deploy_backend.yml --key-file=~/.ssh/aws-vps1.pem
```

### Restarting containers

#### Restarting the frontend

```shell script
ansible-playbook deploy/create_frontend.yml --key-file=~/.ssh/aws-vps1.pem
```

#### Restarting the backend

```shell script
ansible-playbook deploy/create_backend.yml --key-file=~/.ssh/aws-vps1.pem
```

### Accessing production database

#### SSH tunnel to access postgres database

```shell script
ssh -L 7001:localhost:7001 ubuntu@prd-vps01.jamezrin.name -i ~/.ssh/aws-vps1.pem
```

Then you can use the postgres CLI client like this

```shell script
psql -h 127.0.0.1 -U timeit_prd -d timeit_prd -p 7001
```

