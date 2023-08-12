const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

export const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    return channel;
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
    throw error;
  }
};

export const sendDomainsForAnalysis = async (domains: string[]) => {
  const channel = await connectToRabbitMQ();
  await channel.assertQueue("domain-analysis");

  for (const domain of domains) {
    const message = JSON.stringify({ domainName: domain });
    channel.sendToQueue("domain-analysis", Buffer.from(message));
  }
};
