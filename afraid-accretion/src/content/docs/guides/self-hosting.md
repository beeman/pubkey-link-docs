---
title: "Self Hosting"
---

## Self-hosting instructions


[PubKey Link](https://github.com/pubkeyapp/pubkey-link) is a Free and Open Source tool that enables token gating on Discord.

PubKey Link is written in Node using the [Nest.js](https://nestjs.com) framework.

This documents explains how to self-host PubKey Link.

If you run into any issues, please don't hesitate to reach out by joining our [Discord](https://discord.gg/XxuZQeDPNf) or ask [beeman](https://discord.com/users/386584531353862154) over DM. We'll be happy to hop on a call and help troubleshooting!

### Dependencies

In order to run PubKey Link, you need the following components:

- [ ] Server that can run Docker containers.
- [ ] Postgres instance for data storage.
- [ ] Redis instance for job queues (ephemeral).
- [ ] Solana RPC endpoint with support for the [Digital Asset Standard API (DAS)](https://github.com/metaplex-foundation/digital-asset-standard-api).

## Step 0: Preparation

Before you start, be sure to gather the following information so that you can go through the installation directly.

### Set up your domain name and point it to the server

You need to decide the DNS name that you will use to access the instance and point it to the server. You can use [Cloudflare](https://developers.cloudflare.com/registrar/get-started/register-domain/) to purchase a DNS name and [Northflank](https://northflank.com/docs/v1/application/getting-started/add-a-and-verify-domain) as your hosting server. 

It's important do decide this early on as you will need it in the configuration of the environment variables, as well as your Discord Application.

In this tutorial, we will use `pubkey.example.com`.

### Create Discord Application

We will use the Discord app for authentication to log in to the instance and for the bot that will manage the roles.

1. Navigate to the [Discord Developer Portal](https://discord.com/developers)
2. Click `New Application`, fill in the form and click `Create`.

    ![image](../../../assets/self-hosting/create_application.png)

3. Navigate to the `OAuth2` screen:
    - In the `Client Information` section:
        - Copy the `Client ID` and save the value. This is used as `AUTH_DISCORD_CLIENT_ID` in the next step.
        - Click `Reset Secret`, agree to the prompt, then copy the `Client Secret` and save the value. This is used as `AUTH_DISCORD_CLIENT_SECRET` in the next step.
    - In the `Redirects` section:
        - Click the `Add Redirect` button and add the following:
          `https://pubkey.example.com/api/auth/discord/callback`, making sure you replace the domain `pubkey.example.com` with the one you set up in the previous step. 
4. Navigate to the `Bot` page:
    - In the `Token` section, click the `Reset Token` button, copy the value and save it. This value is used when configuring the bot once the instance is running.
    - In the `Privileged Gateway Intents` section, enable the `Server Members Intent` and hit `Save Changes` in the button that popped up.

      ![image](../../../assets/self-hosting/disocrd_intents.png)

5. You have now created the Discord Application with the minimal configuration:
    - You saved the `AUTH_DISCORD_CLIENT_ID` and `AUTH_DISCORD_CLIENT_SECRET`.
    - You configured the `Redirect URL`.
    - You saved the `Bot Token`.
    - You enabled the `Server Members Intent`.

6. You can move on to the next step.



### Collect environment variables

The environment variables below are the mininal to get a working setup using Discord for authentication.

You can find the complete list of supported variables in [`.env.example`](https://github.com/pubkeyapp/pubkey-link/blob/dev/.env.example) in the project repo.

Before you get started:
- Be sure you set up your domain name.
- Be sure to follow the Discord Application instructions above.
- PubKey Link uses [Cloak](https://github.com/47ng/cloak) to encrypt values in the database. Use the [web interface](https://cloak.47ng.com/) or CLI to generate the keychain and master key.
- By default, the instance will run on port 3000. You can override this by using the `PORT` env variable, but most hosting providers will do this for you.


Variable|Example|Description
---|---|---
API_URL                    |`https://pubkey.example.com/api`    | FQDN to the API with the `/api` path
AUTH_DISCORD_ADMIN_IDS     |`123456789,987654321`               | Comma-separated list of user ids of the Discord users that get the Admin role on login.
AUTH_DISCORD_CLIENT_ID     |`123456789123456789`                | Discord OAuth2 Client Secret collected in the previous step.
AUTH_DISCORD_CLIENT_SECRET |`XYZ_ABC-123_456`                   | Discord OAuth2 Client Secret collected in the previous step.
CLOAK_MASTER_KEY           |`k1.aesgcm256.abc-defghi-jk=`       | Cloak master key as mentioned above.
CLOAK_KEYCHAIN             |`v1.aesgcm256.123abc.123-abc.defgi` | Cloak keychain as mentioned above.
DATABASE_URL               |`postgres://user:pass@host:5432/db` | Postgres connection string
HOST                       |`0.0.0.0`                           | Network interface the container listens on. You probably want `0.0.0.0` for most setups. 
JWT_SECRET                 |`some random string`                | The JWT secret, you can generate a good random string with `openssl rand -hex 32`
REDIS_URL                  |`redis://host:6379`                 | Redis connection string.
SESSION_SECRET             |`some random string`                | The JWT secret, you can generate a good random string with `openssl rand -hex 32`
SOLANA_MAINNET_ENDPOINT    | `https://mainnet.helius-rpc.com/?api-key=<API KEY>` | The RPC endpoint for Mainnet.

## Step 1: Installation

After collecting the required information in the previous step, follow these steps to get a working setup.

With the above information, you can configure the environment in your hosting infrastructure and start the container.

The Docker images are hosted on [GHCR](https://github.com/pubkeyapp/pubkey-link/pkgs/container/pubkey-link).

### Main branch (Recommended)

> Most instances probably want to use the `main` branch which is updated less often and more stable.
>
> `ghcr.io/pubkeyapp/pubkey-link:latest`

### Dev branch

> If you want to run the latest and greatest, or you like living on the edge, you can run the `dev` branch.
> 
> `ghcr.io/pubkeyapp/pubkey-link:dev`
> 
> After you start the container, the links on how to access the UI will be logged in the terminal.

### Northflank Installation

Follow the steps below to deploy PubKey Link on Northflank. This method allows you to easily manage databases, secrets, and services using Northflank's interface.

1. **Create a New Project**
   - Choose a name and region for your project
   
   ![create_project_northflank](../../../assets/self-hosting/northflank_region.png)


2. **Set Up Addons**
   - Navigate to the **Addons** tab.
     + Select the databases you need (PostgreSQL and Redis).
     + Choose a name, select the latest version, and enable the **Deploy with TLS** option.
     + Configure the resources you want to allocate to each database.
     
     ![addons_northflank](../../../assets/self-hosting/northflank_addons.png)

3. **Configure Secrets**
   - Go to the **Secrets** tab.
     + Choose a name for your secrets group (e.g., `databases`).
     + Set the **Type** field to `Secret Values`.
     + Ensure the **Scope** field is set to `Runtime`.
     + Under the **Secrets** section, add all the environment variables you collected earlier.
     
     ![secrets_northflank_p1](../../../assets/self-hosting/northflank_secrets.png)
     
     + Link the created Postgres and Redis addons:
        1. Configure the Postgres addon to set the `POSTGRES_URI` variable with the alias `DATABASE_URL`.
        2. Configure the Redis addon to set the `REDIS_MASTER_URL` variable with the alias `REDIS_URL`.
    
    ![secrets_northflank_p2](../../../assets/self-hosting/northflank_link_postgres.png)

    ![secrets_northflank_p3](../../../assets/self-hosting/northflank_link_redis.png)


4. **Create and Configure a Service**
   - Go to the **Services** tab.
      + Create a new service (e.g., name it `api`).
      + Select the **Deploy Docker Image** option.
      + Under the **Deployment** section, choose **External Image** and paste the PubKey image URL (`ghcr.io/pubkeyapp/pubkey-link:latest` or `ghcr.io/pubkeyapp/pubkey-link:dev`).
     
     ![service_northflank_p1](../../../assets/self-hosting/northflank_service_p1.png)

     
    - In the **Networking** section:
        + Check **Publicly expose this port to the internet**.
        + Under **Custom domains & security rules**, select the domain you previously created and [linked](https://northflank.com/docs/v1/application/getting-started/add-a-and-verify-domain). Check the box to disable the default `.run` domain.

        
        ![service_northflank_p2](../../../assets/self-hosting/northflank_service_p2.png)

    - Allocate the necessary resources to the service.



## Step 2: Configuration

Now that you have a working setup, you can log in to your PubKey Link instance and configure your community and its roles and permissions.

### Create a Community

To get started with creating a community, navigate to the **Communities** tab and click the **Create** button. Fill in the relevant information to complete setup.

![create](../../../assets/self-hosting/discord_configuration_p1.png)

![create_community](../../../assets/self-hosting/discord_configuration_p2.png)


### Configure Community

After successfully creating your community, select it from the **Communities** tab to access your dashboard.

- **Configure a Discord Bot**
  To create a Discord bot for your instance, go to the **Discord** tab on the left-hand side. Enter the **Client ID**, **Client Secret**, and **Token** values that you collected earlier ([see the Environment Variables section](#Collect-environment-variables)).
  
  Once the bot is set up, you can use the available buttons to **Start**, **Stop**, **Manage**, or **Invite** the bot to your Discord server(s).

- **Create and Assign Roles**
  To create and assign roles, navigate to the **Roles** tab on the left-hand side and click the **Create** button. Provide a name for the role and follow the setup wizard:
  1. Select the asset type (fungible or non-fungible) and the amount required to obtain the role.
  2. After setting the conditions for acquiring the role, click the **Add Permission** button in the **Permissions** section.
  3. In the permissions configuration, choose the server where this condition will be checked and the Discord role to be awarded (ensure this role has already been created in your Discord server and is below the bot role in the hierarchy table).
