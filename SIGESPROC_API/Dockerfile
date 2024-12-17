# Use the .NET 5 SDK to build the application
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build

WORKDIR /app

# Copy everything to the /app directory
COPY . .

# Restore the dependencies for the project
RUN dotnet restore

# Build the project
RUN dotnet publish -c Release -o out

# Use the runtime image for .NET 5 to run the app
FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS runtime

WORKDIR /app

# Copy the built output from the build image
COPY --from=build /app/out .

# Expose the port your API will listen on
EXPOSE 80

# Set the entry point for the API
ENTRYPOINT ["dotnet", "SIGESPROC.API.dll"]