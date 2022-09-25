import { Appointment } from '../entities/appointment'
import { AppointmentRepository } from '../repositories/appointments-repository'

interface CreateAppointmentRequest {
    customer: string
    startsAt: Date
    endsAt: Date
}

type CreateAppointmentResponse = Appointment

export class CreateAppointment {
    constructor(
        private appointementRepository: AppointmentRepository
    ) {}

    async execute({
        customer, 
        startsAt, 
        endsAt
    }: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
        const overlappingAppointment = await this.appointementRepository.findOverlappingAppointment(
            startsAt,
            endsAt
        )

        if (overlappingAppointment){
            throw new Error('Another appointment overlaps this appointment dates')
        }

        const appointment = new Appointment({
            customer, 
            startsAt, 
            endsAt
        })

     await this.appointementRepository.create(appointment)

     return appointment
    }
}