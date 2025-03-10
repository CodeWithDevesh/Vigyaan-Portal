import { Request, Response } from "express"

const projectRequest = async (req: Request, res: Response): Promise<any> => {
    const { project_id, requested_by } = req.body();

    if(!project_id || !requested_by) {
        return res.status(406).json({
            message: "Empty projectId or requested user"
        })
    }

    try {
        const coll = db.collection("requestSchema")
        const alreadyExists = await coll.findOne({
            project_id: project_id,
            requested_by: requested_by
        })

        if(alreadyExists) {
            return res.status(400).json({
                message: "Request from this user already exists"
            })
        }

        await coll.insertOne({
            project_id: project_id,
            requested_by: requested_by
        })

        return res.json({
            message: "Project requested successfully"
        })
    } catch(error) {
        return res.status(501).json({
            message: "Error while requesting project"
        })
    }

}

const sendDm = async (req: Request, res: Response): Promise<any> => {
    const { to, subject, message } = req.body()

    try {
        const coll = db.collection("notificationSchema")

        await coll.insertOne({
            user_id: "1",
            message: message,
            type: "request_sent"
        })

        return res.json({
            message: "Email sent successfully"
        })
    } catch(Error) {
        console.log(Error)
        return res.status(501).json({
            message: "Error while sending dm"
        })
    }
}

const getProjects = async(req: Request, res: Response): Promise<any> => {
    const status = req.query.status
    const branch = req.query.branch

    try {
        const coll = db.collection("projectSchema")
        await coll.find({})

        return res.json({
            Response: coll
        })

    } catch(Error) {
        console.log(Error)
        return res.status(501).json({
            message: "Error while fetching projects"
        })
    }
}


const getProject = async (req: Request, res: Response): Promise<any> => {
    const id = req.params.id

    try {
        const coll = db.collection("projectSchema")
        const project = await coll.findOne({
            id: id
        })

        if(!project) {
            return res.status(404).json({
                message: "Invalid Project ID"
            })
        }

        return res.json({
            Response: project
        })
    } catch(Error) {
        return res.status(501).json({
            message: "Error while fetching the project"
        })
    }
}
export { projectRequest, sendDm, getProjects, getProject }