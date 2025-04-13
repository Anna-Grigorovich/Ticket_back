import {Injectable} from '@nestjs/common';
import {UserModel} from "../mongo/models/user.model";
import {EventRepository} from "../mongo/repositories/event.repository";
import {TicketRepository} from "../mongo/repositories/ticket.repository";
import {SettingsService} from "../services/settings.service";
import {DashboardResponseDto} from "./dto/dashboard-response.dto";

@Injectable()
export class DashboardService {
    constructor(
        private eventsRepository: EventRepository,
        private ticketsRepository: TicketRepository,
        private settingsService: SettingsService,) {}

    async getDashboard(user: UserModel) {
        const [settings, eventsStat, ticketsStat] = await Promise.all([
            this.settingsService.getSettings(),
            this.eventsRepository.getDashboardStats(),
            this.ticketsRepository.getDashboardStats()
        ])
        return DashboardResponseDto.fromModels(user, settings.serviceFee, eventsStat, ticketsStat);
    }
}
