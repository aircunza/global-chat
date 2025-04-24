import container from "../../../../apps/users/dependency-injection";

/**
 * Factory class for creating user repository instances based on the specified type.
 * Uses a dependency injection container to resolve repository implementations.
 */
export class UsersRepositoryFactory {
  /**
   * Creates a repository instance for the given repository type.
   * @param repositoryType - The type of repository (e.g., 'postgresql')
   * @returns The corresponding user repository instance
   * @throws Error if the repository type is unsupported or not found
   */
  static createRepository(repositoryType: string) {
    switch (repositoryType) {
      case "postgresql": {
        const repository = container.get(
          "Contexts.users.infrastructure.persistence.PostgresqlRepository"
        );
        return repository;
      }
      case "mongo":
        // MongoDB is not currently supported
        throw new Error("Repository not found");
      default:
        // Fallback for any unknown repository types
        throw new Error("Repository not found");
    }
  }
}
