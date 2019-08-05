const initialData = {
  tasks: {
    "1": { id: "1", content: "Buy a tent" },
    "2": { id: "2", content: "Buy Gorp" },
    "3": { id: "3", content: "Toothbrush" },
    "4": { id: "4", content: "Canteen and water purifier" },
    "5": { id: "5", content: "sleeping bag" }
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "Camping List",
      taskIds: ["1", "2", "3", "4", "5"]
    }
  },
  columnOrder: ["column-1"]
};

export default initialData;
