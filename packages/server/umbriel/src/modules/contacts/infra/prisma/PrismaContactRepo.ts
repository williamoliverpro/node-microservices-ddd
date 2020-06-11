import DomainEvents from '@server/shared/src/core/domain/events/DomainEvents';

import prisma from '@infra/prisma/client';
import Contact from '@modules/contacts/domain/Contact';
import ContactMap from '@modules/contacts/mappers/ContactMap';
import IContactRepo from '@modules/contacts/repositories/IContactRepo';

export default class PrismaContactRepo implements IContactRepo {
  async save(contact: Contact): Promise<void> {
    const data = ContactMap.toPersistence(contact);

    await prisma.contact.upsert({
      where: { email: contact.email.value },
      update: data,
      create: data,
    });

    DomainEvents.dispatchEventsForAggregate(contact.id);
  }
}