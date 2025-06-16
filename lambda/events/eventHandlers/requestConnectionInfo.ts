import { EventMap } from "../models/eventType.ts";
import { sendToDobby } from "../../utils/sendToDobby.ts";
import { saveEventToDynamoDB } from "../../utils/saveEvent.ts";
import { EventSchemaType } from "../eventsSchema.ts";
import { v4 as uuidv4 } from 'uuid';
import { EventType } from "../eventsSchema.ts";

interface RequestConnectionInfoData {
    device_id: string;
    event_sent?: boolean;
}

export const handleRequestConnectionInfo = async (eventData: RequestConnectionInfoData): Promise<EventSchemaType> => {
    // Create the payload using DataView
    const buffer = new ArrayBuffer(1);
    const view = new DataView(buffer);

    // Command Type
    view.setUint8(0, EventMap.REQUEST_CONNECTION_INFO);

    // Send the command to the device
    await sendToDobby(eventData.device_id, buffer);

    // Create the event object
    const event: EventSchemaType = {
        event_id: uuidv4(),
        event_type: EventType.REQUEST_CONNECTION_INFO,
        event_data: {
            device_id: eventData.device_id,
            event_sent: true
        },
        event_ack: false
    };

    // Save the event to DynamoDB
    await saveEventToDynamoDB(event);

    return event;
}; 