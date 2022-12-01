import gql from 'graphql-tag';






const AllProblemsQuery = gql`
query all_problems_query {
    Problem: comet_problem_problem {
        id
        name
    }
}`;




const ProblemDesignQuery = gql`
query problem_design_query($problem_id: bigint!, $dataset_id: bigint!) {
    design_query: comet_problem_architecture(where: {problem_id: {_eq: $problem_id}, dataset_id: {_eq: $dataset_id}, evaluation_status: {_eq: true}}, order_by: {id: asc}) {
        evaluation_status
        representation
        id
        user_information_id
        origin
        objectives: comet_problem_objectivevalues(order_by: {id: asc}) {
            value
            explanation
            objective_id
            objective_name: comet_problem_objective {
                name
            }
        }
    }
}`;




const InsertMessage = gql`
    mutation InsertMessage($user_info_id: bigint!, $more_info: String!, $message_writer: String!, $message_type: String!, $message: String!) {
        result: insert_comet_assistant_dialoguehistory_one(object: {user_information_id: $user_info_id, more_info: $more_info, message_writer: $message_writer, message_type: $message_type, message: $message, date: "now()", hidden: false, loading: true, response_error: false}) {
            id
        }
    }
`;


const SetMessageHiddenStatus = gql`
    mutation SetMessageHiddenStatus($message_id: bigint!, $hidden: Boolean!) {
        result: update_comet_assistant_dialoguehistory_by_pk(pk_columns: {id: $message_id}, _set: {hidden: $hidden}) {
            id
        }
    }
`;


const SetMessageLoadingStatus = gql`
    mutation SetMessageLoadingStatus($message_id: bigint!, $loading: Boolean!) {
        result: update_comet_assistant_dialoguehistory_by_pk(pk_columns: {id: $message_id}, _set: {loading: $loading}) {
            id
        }
    }
`;

const SetMessageErrorStatus = gql`
    mutation SetMessageErrorStatus($message_id: bigint!, $response_error: Boolean!) {
        result: update_comet_assistant_dialoguehistory_by_pk(pk_columns: {id: $message_id}, _set: {response_error: $response_error}) {
            id
        }
    }
`;



export {
    AllProblemsQuery,
    ProblemDesignQuery,
    InsertMessage,
    SetMessageHiddenStatus,
    SetMessageLoadingStatus,
    SetMessageErrorStatus
}
