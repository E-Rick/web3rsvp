import { gql } from "@apollo/client";

export const MY_UPCOMING_EVENTS = gql`
	query Events($eventOwner: String, $currentTimestamp: String) {
		events(where: { eventOwner: $eventOwner, eventTimestamp_gt: $currentTimestamp }) {
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