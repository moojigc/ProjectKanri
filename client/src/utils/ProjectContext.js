import { createContext } from "react";

const ProjectContext = createContext({
    _id: "",
    title: "",
    description: "",
    createdAt: "",
    updatedAt: "",
    tasks: [],
    admins: [],
    members: [],
    creator: ""
})