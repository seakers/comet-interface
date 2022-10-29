import gql from 'graphql-tag';






const AllProblemsQuery = gql`
query all_problems_query {
    Problem: comet_problem_problem {
        id
        name
    }
}`;




const ProblemDesignQuery = gql`
query problem_design_query($problem_id: bigint!) {
    design_query: comet_problem_architecture(where: {problem_id: {_eq: $problem_id}, evaluation_status: {_eq: true}}, order_by: {id: asc}) {
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
    AllProblemsQuery,
    ProblemDesignQuery
}
