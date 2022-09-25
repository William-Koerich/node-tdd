import { describe, expect, it } from 'vitest'
import { Appointment } from '../entities/appointment'
import { InMemoryAppointmentsRepository } from '../entities/in-memory/in-memory-appointments-repository'
import { getFutureDate } from '../tests/utils/get-future-date'
import { CreateAppointment } from './create-appointment'

describe('Create Appointment', () => {
    it('should be able to create an appointment', () => {
        const startsAt = getFutureDate('2022-08-10')
        const endsAt = getFutureDate('2022-08-09')

        const appointementRepository = new InMemoryAppointmentsRepository
        const createAppointment = new CreateAppointment(appointementRepository)
        
        expect(createAppointment.execute({
            customer: 'William Koerich',
            startsAt,
            endsAt
        })).resolves.toBeInstanceOf(Appointment)
    })

    it('should not be able to create an appointment with overlapping dates', async () => {
        const startsAt = getFutureDate('2022-08-10')
        const endsAt = getFutureDate('2022-08-15')

        const appointementRepository = new InMemoryAppointmentsRepository
        const createAppointment = new CreateAppointment(appointementRepository)

        await createAppointment.execute({
            customer: 'William Koerich',
            startsAt,
            endsAt
        })
        
        expect(createAppointment.execute({
            customer: 'William Koerich',
            startsAt: getFutureDate('2022-08-14'),
            endsAt: getFutureDate('2022-08-18')
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            customer: 'William Koerich',
            startsAt: getFutureDate('2022-08-08'),
            endsAt: getFutureDate('2022-08-14')
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            customer: 'William Koerich',
            startsAt: getFutureDate('2022-08-08'),
            endsAt: getFutureDate('2022-08-17')
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            customer: 'William Koerich',
            startsAt: getFutureDate('2022-08-11'),
            endsAt: getFutureDate('2022-08-12')
        })).rejects.toBeInstanceOf(Error)
    })
})