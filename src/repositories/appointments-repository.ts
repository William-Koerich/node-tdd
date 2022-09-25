import { Appointment } from "../entities/appointment";

export interface AppointmentRepository{
    create(appointment: Appointment): Promise<void>
    findOverlappingAppointment(startsAt: Date, endsAt: Date): Promise<Appointment | null>
}