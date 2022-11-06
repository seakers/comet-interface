import {
    ReceiveMessageCommand,
    SendMessageCommand,
    ChangeMessageVisibilityBatchRequestEntry,
    ChangeMessageVisibilityBatchCommand, DeleteMessageCommand
} from "@aws-sdk/client-sqs";
import {sqsClient} from "./sqsClient";





export async function delete_message(queue_url, message){
    const command = new DeleteMessageCommand({
        QueueUrl: queue_url,
        ReceiptHandle: message['ReceiptHandle']
    });
    const response = await sqsClient.send(command);
}





export async function send_ping_message(queue_url){
    const command = new SendMessageCommand({
        QueueUrl: queue_url,
        MessageBody: "boto3",
        MessageAttributes: {
            msgType: {
                DataType: "String",
                StringValue: "ping"
            }
        }
    });
    const response = await sqsClient.send(command);
}





export async function poll_message(queue_url){
    let counter = 0;
    let attempts = 3;
    let message = null;
    while(message === null){
        message = await receive_message(queue_url);
        counter += 1;
        if(counter >= attempts){
            return null;
        }
    }
    return message;
}


export async function receive_message(queue_url){
    const command = new ReceiveMessageCommand({
        QueueUrl: queue_url,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 5,
        MessageAttributeNames: ['All']
    });
    const response = await sqsClient.send(command);
    if(response['Messages'] !== null){
        return response['Messages'][0];
    }
    return null;
}








export async function poll_spec_message(queue_url, msgType) {

}


export async function receive_spec_message(queue_url, msgType){
    const command = new ReceiveMessageCommand({
        QueueUrl: this.ping_response_queue,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 5,
        MessageAttributeNames: ['All']
    });
    const response = await sqsClient.send(command);
    if(response['Messages'] !== null){
        let messages = response['Messages'];
        let messages_matched = [];
        let replace_receipts = [];
        for(let x = 0; x < messages.length; x++){
            let message = messages[x];
            let receipt = message['ReceiptHandle']
            if(message['MessageAttributes']['msgType']['StringValue'] === msgType){
                messages_matched.push(message);
            }
            else{
                replace_receipts.push({ ReceiptHandle: receipt, VisibilityTimeout: 0});
            }
        }
        if(replace_receipts.length > 0){
            const request = new ChangeMessageVisibilityBatchCommand({
                QueueUrl: queue_url,
                Entries: replace_receipts
            });
            const response2 = await sqsClient.send(command);
        }
        return messages_matched;
    }
    return null;
}