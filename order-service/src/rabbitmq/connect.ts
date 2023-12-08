import ampq, { Channel, Connection } from "amqplib";

let connection: Connection, channel:Channel;

export const connecttoRabbitMQ = async () => {
  const amqpServer = "amqp://127.0.0.1:5672";
  try {
    if (amqpServer) connection = await ampq.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("ORDER");
    console.log("rabbit mq success");
  } catch (error) {
    console.log(error);
  }
};

export const getRabbitMqChannel = () => {
    return channel
}

