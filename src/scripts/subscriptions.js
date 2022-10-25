import gql from 'graphql-tag';





const UserProblemsSub = gql`
query user_problems_sub($user_info_id: bigint!) {
    user_problems: comet_problem_problem(where: {comet_problem_userproblems: {user_information_id: {_eq: $user_info_id}}}) {
        id
        name
    }
}`;


const SelectedUserProblemSub = gql`
query selected_user_problem_sub($user_info_id: bigint!) {
    problem_id_sub: comet_auth_userinformation(where: {id: {_eq: $user_info_id}}) {
        problem_id
    }
}`;


const SelectedProblemInfoSub = gql`
query selected_problem_info_sub($problem_id: bigint!) {
    problem_info: comet_problem_problem(where: {id: {_eq: $problem_id}}) {
        id
        name
        objectives: comet_problem_objectives {
            id
            name
            type
        }
    }
}`;


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
subscription design_exists_sub($problem_id: bigint!, $representation: String!) {
    design_sub: comet_problem_architecture(where: {problem_id: {_eq: $problem_id}, representation: {_eq: $representation}}) {
        id
        representation
        evaluation_status
    }
}`;




const ProblemDesignsSub = gql`
subscription problem_designs_sub($problem_id: bigint!) {
    designs_sub: comet_problem_architecture(where: {problem_id: {_eq: $problem_id}}, order_by: {id: asc}) {
        evaluation_status
        representation
        id
        user_information_id
        objectives: comet_problem_objectivevalues(order_by: {id: asc}) {
            value
            explanation
            objective_id
        }
    }
}`;





export {
    UserProblemsSub,
    SelectedUserProblemSub,
    SelectedProblemInfoSub,
    ProblemDecisionsSub,
    DesignExistsSub,
    ProblemDesignsSub
}