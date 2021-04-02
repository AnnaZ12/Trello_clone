const initialData = [
  {
    name: '1111',
    id: '1',
    img: `url('https://images.unsplash.com/photo-1614194403514-b35102902d94?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')`,
    content: [
      {
        listTitle: 'list1', id: 'list1', tasks: [
          { id: 'task-1', taskTitle: 'task 1', card: [] },
          { id: 'task-2', taskTitle: 'task 2' },
          { id: 'task-3', taskTitle: 'task 3' },
          { id: 'task-4', taskTitle: 'task 4' },
        ]
      },
      {
        listTitle: 'list2', id: 'list2', tasks: [
          { id: 'task-5', taskTitle: 'task 5' },
          { id: 'task-6', taskTitle: 'task 6' },
        ]
      },
      { listTitle: 'list3', id: 'list3', tasks: [] },
      { listTitle: 'list4', id: 'list4', tasks: [] },
    ]
  },
  {
    name: '222',
    id: '2',
    img: 'purple',
    content: []
  },
];

export default initialData;
