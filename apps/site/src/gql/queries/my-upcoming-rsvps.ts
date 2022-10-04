import { gql } from "@apollo/client";

export const MY_UPCOMING_RSVPS = gql`
	query MyUpcomingRsvps($id: String) {
		account(id: $id) {
			id
			rsvps {
				event {
					id
					name
					eventTimestamp
					imageURL
				}
			}
		}
	}
`