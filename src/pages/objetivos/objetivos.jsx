import React, { useEffect, useState } from 'react';
import { getTasks, addTask, deleteTask, updateTask } from '../../apiService/tasksApi';
import { getGoals, updateGoal } from '../../apiService/goalApi';
import { Progress, Collapse, List, Checkbox, Button, message, Modal } from 'antd';
import NewTaskModal from '../../components/modals/modalTasks';
import { useAuth } from '../../contexts/authContext';

const { Panel } = Collapse;

const Objetivos = () => {
  const [goals, setGoals] = useState([]);
  const [activeKey, setActiveKey] = useState([]);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  const { userId } = useAuth(); 
  console.log('userId', userId);

  const fetchGoalsAndTasks = async () => {
    const fetchedGoals = await getGoals();
    const tasks = await getTasks();
    console.log('tasks', tasks);
    console.log('fetchedGoals', fetchedGoals);

    const filteredGoals = fetchedGoals.filter(goal => goal.employeeId._id === userId);
    console.log('filteredGoals', filteredGoals);

    const grouped = filteredGoals.reduce((acc, goal) => {
      acc[goal._id] = {
        goalId: goal._id,
        goalName: goal.goalName,
        goalDescription: goal.goalDescription,
        goalStatus: goal.goalStatus,
        tasks: []
      };
      return acc;
    }, {});

    tasks.forEach(task => {
      if (grouped[task.goalId._id]) {
        grouped[task.goalId._id].tasks.push({
          id: task._id,
          goalId: task.goalId._id,
          name: task.taskName,
          description: task.taskDescription,
          status: task.taskStatus
        });
      }
    });

    setGoals(Object.values(grouped));
    return Object.values(grouped);
  };

  useEffect(() => {
    fetchGoalsAndTasks();
  }, [userId]);

  const togglePanel = key => {
    setActiveKey(key.length ? key : []);
  };

  const calculateProgress = (goal) => {
    const tasks = goal.tasks;
    if (goal.goalStatus === 'Completado') {
      return 100;
    }
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status !== 'Pendiente').length;
    return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  };

  const updateGoalStatus = async (goalId) => {
    const updatedGoals = await fetchGoalsAndTasks();

    const goal = updatedGoals.find(goal => goal.goalId === goalId);
    const totalTasks = goal.tasks.length;
    const completedTasks = goal.tasks.filter(task => task.status === 'Completado').length;

    let newStatus = 'Pendiente';
    if (completedTasks === totalTasks && totalTasks > 0) {
      newStatus = 'Completado';
    } else if (completedTasks > 0) {
      newStatus = 'En proceso';
    }

    await handleUpdateGoal(goalId, { goalStatus: newStatus });
    fetchGoalsAndTasks();
  };

  const handleCreateTask = async (values) => {
    try {
      await addTask(values);
      message.success('Task created successfully!');
      await fetchGoalsAndTasks();
    } catch (error) {
      message.error('Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      message.success('Task deleted successfully!');
      await fetchGoalsAndTasks();
    } catch (error) {
      message.error('Failed to delete task');
    }
  };

  const handleUpdateTask = async (taskId, data) => {
    try {
      await updateTask(taskId, data);
      message.success('Task updated successfully!');
    } catch (error) {
      message.error('Failed to update task');
    }
  };

  const handleUpdateGoal = async (goalId, data) => {
    try {
      await updateGoal(goalId, data);
      message.success('Goal updated successfully!');
      await fetchGoalsAndTasks();
    } catch (error) {
      message.error('Failed to update goal');
    }
  };

  const handleTaskStatusChange = async (task) => {
    const newStatus = task.status === 'Pendiente' ? 'Completado' : 'Pendiente';
    await handleUpdateTask(task.id, { taskStatus: newStatus });

    const updatedGoals = await fetchGoalsAndTasks();
    const goal = updatedGoals.find(goal => goal.goalId === task.goalId);
    console.log('goal', goal);
    const pendingTasks = goal.tasks.filter(t => t.status === 'Pendiente');

    if (newStatus === 'Completado' && pendingTasks.length === 0) {
      Modal.confirm({
        title: '¿Deseas marcar el objetivo como completado?',
        onOk: async () => {
          await handleUpdateGoal(task.goalId, { goalStatus: 'Completado' });
        }
      });
    } else {
      await updateGoalStatus(task.goalId);
    }
  };

  const markGoalAsCompleted = async (goalId) => {
    Modal.confirm({
      title: '¿Deseas marcar el objetivo como completado?',
      onOk: async () => {
        await handleUpdateGoal(goalId, { goalStatus: 'Completado' });
      }
    });
    await fetchGoalsAndTasks();
  };

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold">Objetivos</h2>
      </div>
      <Collapse
        bordered={true}
        activeKey={activeKey}
        onChange={togglePanel}
        expandIconPosition="right"
      >
        {goals.map(goal => {
          const percent = calculateProgress(goal);
          const header = (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{goal.goalName}</span>
              <Progress percent={percent} type="line" style={{ width: '50%' }} />
            </div>
          );

          return (
            <Panel header={header} key={goal.goalId}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>{goal.goalDescription}</p>
                <div>
                  <Button
                    type="dashed"
                    onClick={() => {
                      setSelectedGoalId(goal.goalId);
                      setIsTaskModalVisible(true);
                    }}
                    style={{ marginRight: '8px' }}
                  >
                    Añadir tarea
                  </Button>
                  <Button
                    type="dashed"
                    onClick={() => markGoalAsCompleted(goal.goalId)}
                  >
                    Marcar como completado
                  </Button>
                </div>
              </div>
              {goal.tasks.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={goal.tasks}
                  renderItem={task => (
                    <List.Item
                      actions={[
                        <Button type="link" onClick={() => handleDeleteTask(task.id)}>Eliminar</Button>,
                        <Checkbox
                          checked={task.status !== 'Pendiente'}
                          onChange={() => handleTaskStatusChange(task)}
                        />,
                      ]}
                    >
                      <List.Item.Meta
                        title={task.name}
                        description={task.description}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <p>No hay tareas asignadas a este objetivo.</p>
              )}
            </Panel>
          );
        })}
      </Collapse>
      <NewTaskModal
        visible={isTaskModalVisible}
        onCancel={() => setIsTaskModalVisible(false)}
        onCreate={handleCreateTask}
        goalId={selectedGoalId}
      />
    </div>
  );
};

export default Objetivos;
