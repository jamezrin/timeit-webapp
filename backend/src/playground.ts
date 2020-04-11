import 'reflect-metadata';
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import {Project} from "./entity/Project";
import {ProjectUser, ProjectUserRole, ProjectUserStatus} from "./entity/ProjectUser";
import {SessionAppEvent} from "./entity/SessionAppEvent";
import {Session} from "./entity/Session";

createConnection().then(async connection => {
    console.log("Connected to the database")

    await User.delete({})
    await Project.delete({})

    console.log("Testing inserts...")
    const user = new User();
    user.dateOfBirth = new Date(
        2020, 4, 11,
        22, 30, 15);
    user.firstName = "Jaime";
    user.lastName = "Martínez Rincón";
    user.passwordHash = "some random hash";
    user.emailAddress = "jaime@jamezrin.name";
    await user.save()

    const project = new Project();
    project.name = "Un proyecto muy bueno";
    await project.save();

    const projectUser = new ProjectUser();
    projectUser.user = user;
    projectUser.project = project;
    projectUser.role = ProjectUserRole.ADMIN;
    projectUser.status = ProjectUserStatus.ACTIVE;
    await projectUser.save();

    await connection.close();
}).catch(error => console.log(error))