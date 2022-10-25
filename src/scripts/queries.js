import gql from 'graphql-tag';






const AllProblemsQuery = gql`
query all_problems_query {
    Problem: comet_problem_problem {
        id
        name
    }
}`;








export {
    AllProblemsQuery
}
