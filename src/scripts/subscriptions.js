import gql from 'graphql-tag';



const UserProblemsSub = gql`
subscription user_problems_sub($user_info_id: bigint!) {
    user_problems: comet_problem_problem(where: {comet_problem_userproblems: {user_information_id: {_eq: $user_info_id}}}) {
        id
        name
    }
}`;


const UserDatasetsSub = gql`
subscription user_datasets_sub($user_info_id: bigint!, $problem_id: bigint!) {
    user_datasets: comet_problem_dataset(where: {comet_problem_userdatasets: {user_information_id: {_eq: $user_info_id}}, problem_id: {_eq: $problem_id}}) {
        id
        name
        default
        problem_id
    }
}`;




const CurrentUserProblemSub = gql`
subscription current_user_problem_sub($user_info_id: bigint!) {
    problem_id_sub: comet_auth_userinformation(where: {id: {_eq: $user_info_id}}) {
        problem_id
    }
}`;








const CurrentProblemInfoSub = gql`
subscription current_problem_info_sub($problem_id: bigint!) {
    problem_subscription: comet_problem_problem(where: {id: {_eq: $problem_id}}) {
        id
        name
        objectives: comet_problem_objectives {
            id
            name
            type
        }
    }
}`;


const ProblemDesignSubscription = gql`
    subscription problem_design_subscription($problem_id: bigint!, $dataset_id: bigint!, $id_list: [bigint!]) {
        design_subscription: comet_problem_architecture(where: {problem_id: {_eq: $problem_id}, dataset_id: {_eq: $dataset_id}, evaluation_status: {_eq: true}, id: {_nin: $id_list}}, order_by: {id: asc}) {
            evaluation_status
            representation
            id
            user_information_id
            origin
            objectives: comet_problem_objectivevalues(order_by: {objective_id: asc}) {
                value
                explanation
                objective_id
                objective_name: comet_problem_objective {
                    name
                }
            }
        }
    }
`;






const ProblemDecisionsSub = gql`
    subscription problem_decisions_sub($problem_id: bigint!) {
        decisions: comet_problem_decision(where: {problem_id: {_eq: $problem_id}}, order_by: {id: asc}) {
            id
            name
            type
            alternatives: comet_problem_alternatives(order_by: {id: asc}) {
                id
                value
                description
            }
        }
    }`;



const DesignExistsSub = gql`
    subscription design_exists_sub($problem_id: bigint!, $dataset_id: bigint!, $representation: String!) {
        design_sub: comet_problem_architecture(where: {problem_id: {_eq: $problem_id}, dataset_id: {_eq: $dataset_id}, representation: {_eq: $representation}}) {
            id
            representation
            evaluation_status
        }
    }
`;





const MessageSubscription = gql`
    subscription MessageSubscription($user_info_id: bigint!) {
        messages_db: comet_assistant_dialoguehistory(where: {user_information_id: {_eq: $user_info_id}, hidden: {_eq: false}}, order_by: {date: asc}) {
            id
            date
            message
            message_type
            message_writer
            more_info
            hidden
            loading
            response_error
        }
    }
`;






export {
    UserProblemsSub,
    CurrentUserProblemSub,
    CurrentProblemInfoSub,
    ProblemDecisionsSub,
    DesignExistsSub,
    ProblemDesignSubscription,
    UserDatasetsSub,
    MessageSubscription
}