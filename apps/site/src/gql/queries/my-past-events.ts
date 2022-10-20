
import { gql } from "@apollo/client";

export const MY_PAST_EVENTS = gql`
	query Events($eventOwner: String, $currentTimestamp: String) {
		events(where: { eventOwner: $eventOwner, eventTimestamp_lt: $currentTimestamp }) {
			id
			eventID
			name
			description
			eventTimestamp
			maxCapacity
			totalRSVPs
			imageURL
		}
	}
`