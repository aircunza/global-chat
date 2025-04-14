import container from "../../../../apps/auth/dependency-injection";

export class AuthRepositoryFactory {
  static createRepository(repositoryType: string) {
    switch (repositoryType) {
      case "postgresql": {
        const repository = container.get(
          "Contexts.auth.infrastructure.persistence.PostgresqlRepository"
        );
        return repository;
      }
      default:
        throw new Error("Repository not found");
    }
  }
}
