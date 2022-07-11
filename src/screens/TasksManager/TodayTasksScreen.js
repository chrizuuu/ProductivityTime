import React from "react"
import withObservables from "@nozbe/with-observables"
import TasksList from "../../components/List/TasksList"
import NewTaskButton from "../../components/Buttons/NewTaskButton"
import TaskDAO from "../../database/DAO/TaskDAO"

const TodayTasksScreen = ({ tasks }) => {
  return (
    <>
      <TasksList tasks={tasks} />
      <NewTaskButton />
    </>
  )
}

const enhance = withObservables([], () => ({
  tasks: TaskDAO.observeTodayTasks(), // set global var in mobx to query
}))

export default enhance(TodayTasksScreen)
