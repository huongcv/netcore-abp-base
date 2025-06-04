# Use the official .NET Core SDK image as a build stage
FROM harbor.orenda.vn/netcore/dotnet-sdk:8.0 AS build
WORKDIR /app

# Copy the project files and restore dependencies
# COPY *.csproj .
# RUN dotnet restore

# Copy the rest of the application files
COPY . .

# Build the application
RUN dotnet publish host/Ord.Pos.HttpHost/Ord.Pos.HttpHost.csproj -c Release -o out

# Use the official .NET Core runtime image for the runtime stage
FROM harbor.orenda.vn/netcore/aspnet:8.0 AS runtime
WORKDIR /app

# Copy the build output from the build stage
COPY --from=build /app/out .

# Set the entry point to run the application
ENTRYPOINT ["dotnet", "Ord.Pos.HttpHost.dll"]