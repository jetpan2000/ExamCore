FROM microsoft/dotnet:2.1-aspnetcore-runtime-nanoserver-1709 AS base
WORKDIR /app
EXPOSE 53433
EXPOSE 44335

FROM microsoft/dotnet:2.1-sdk-nanoserver-1709 AS build
WORKDIR /src
COPY ASPNETMVC/ASPNETMVC.csproj ASPNETMVC/
RUN dotnet restore ASPNETMVC/ASPNETMVC.csproj
COPY . .
WORKDIR /src/ASPNETMVC
RUN dotnet build ASPNETMVC.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish ASPNETMVC.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "ASPNETMVC.dll"]
