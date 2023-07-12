FROM hub.lumigame.com/base/dotnet/core/sdk:7.0-alpine AS builder

WORKDIR /src

COPY ./MemberLoginApiSimulator/MemberLoginApiSimulator.csproj ./MemberLoginApiSimulator/MemberLoginApiSimulator.csproj

WORKDIR /src/MemberLoginApiSimulator
RUN dotnet restore -v diag

COPY ./MemberLoginApiSimulator .
RUN dotnet publish -r linux-x64 --self-contained false -o /app 

FROM hub.lumigame.com/base/dotnet/core/aspnet:7.0-alpine AS base
RUN adduser -D member_api_user
USER member_api_user 
WORKDIR /app
COPY --from=builder /app .

ENTRYPOINT ["dotnet", "MemberLoginApiSimulator.dll"]
