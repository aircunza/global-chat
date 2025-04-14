import { ContainerBuilder, YamlFileLoader } from "node-dependency-injection";

import { configApps } from "../../config";

const container = new ContainerBuilder();
const loader = new YamlFileLoader(container);
const env = configApps.envApp;

loader.load(`${__dirname}/application_${env}.yaml`);
export default container;
