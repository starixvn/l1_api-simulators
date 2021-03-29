FROM registry.nexdev.net:5050/docker/dotnet/core/sdk:3.1 AS builder

WORKDIR /src

COPY ./OW.ApiSimulator/OW.ApiSimulator.csproj ./OW.ApiSimulator/OW.ApiSimulator.csproj

WORKDIR /src/OW.ApiSimulator
RUN dotnet restore -v diag

COPY ./OW.ApiSimulator .
RUN dotnet publish -r linux-x64 --self-contained false -o /app 

FROM registry.nexdev.net:5050/docker/dotnet/core/aspnet:3.1-buster-slim AS base

WORKDIR /app
COPY --from=builder /app .

ENTRYPOINT ["dotnet", "OW.ApiSimulator.dll"]
