FROM git3.nexdev.net:5050/lumi-ops/docker-images/dotnet/core/sdk:3.1 AS builder

WORKDIR /src

ARG DEPLOY_ENV=DEV
RUN echo $DEPLOY_ENV

COPY ./OW.ApiSimulator/OW.ApiSimulator.csproj ./OW.ApiSimulator/OW.ApiSimulator.csproj

WORKDIR /src/OW.ApiSimulator
RUN dotnet restore -v diag

COPY ./OW.ApiSimulator .
RUN dotnet publish -c $DEPLOY_ENV -r linux-x64 --self-contained false -o /app 

FROM git3.nexdev.net:5050/lumi-ops/docker-images/dotnet/core/aspnet:3.1 AS base

WORKDIR /app
COPY --from=builder /app .

ENTRYPOINT ["dotnet", "OW.ApiSimulator.dll"]