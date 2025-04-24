import container from "../../../../apps/auth/dependency-injection";

/**
 * Factory class responsible for creating instances of authentication repositories.
 *
 * - Uses dependency injection to retrieve implementations based on the given type.
 * - Currently supports "postgresql".
 */
export class AuthRepositoryFactory {
  /**
   * Creates and returns an instance of the requested repository type.
   *
   * @param repositoryType - The type of repository to create ("postgresql" is supported).
   * @returns The repository instance from the dependency injection container.
   * @throws Error if the repository type is not supported or not found.
   */
  static createRepository(repositoryType: string) {
    switch (repositoryType) {
      case "postgresql": {
        // Retrieve the PostgreSQL repository implementation from the DI container
        const repository = container.get(
          "Contexts.auth.infrastructure.persistence.PostgresqlRepository"
        );
        return repository;
      }
      case "mongo":
        throw new Error("Repository not found"); // Mongo is not supported yet
      default:
        throw new Error("Repository not found"); // Handle unknown repository types
    }
  }
}
