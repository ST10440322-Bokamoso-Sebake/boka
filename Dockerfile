FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["BokaMarket.Server/BokaMarket.Server.csproj", "BokaMarket.Server/"]
COPY ["BokaMarket.Shared/BokaMarket.Shared.csproj", "BokaMarket.Shared/"]
RUN dotnet restore "BokaMarket.Server/BokaMarket.Server.csproj"
COPY . .
WORKDIR "/src/BokaMarket.Server"
RUN dotnet build "BokaMarket.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "BokaMarket.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BokaMarket.Server.dll"]
