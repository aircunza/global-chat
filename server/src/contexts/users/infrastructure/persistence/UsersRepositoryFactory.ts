import container from "../../../../apps/users/dependency-injection";

export class UsersRepositoryFactory {
  static createRepository(repositoryType: string) {
    switch (repositoryType) {
      case "postgresql": {
        const repository = container.get(
          "Contexts.users.infrastructure.persistence.PostgresqlRepository"
        );
        return repository;
      }
      default:
        throw new Error("Repository not found");
    }
  }
}
