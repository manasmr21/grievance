import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { HostelRoomService } from "./hostelRoom.service";
import { HostelRoomDto } from "./dto/hostelRoom.dto";
import { ApiBody, ApiTags } from "@nestjs/swagger";

@ApiTags("Hostel Rooms")
@Controller("hostel-room")
export class HostelRoomController {
  constructor(private readonly hostelRoomService: HostelRoomService) { }

  @Post("create")
  create(@Body() data: HostelRoomDto) {
    return this.hostelRoomService.createHostelRoom(data);
  }

  @Get()
  findAll() {
    return this.hostelRoomService.getAllHostelRooms();
  }

  @Get("hostel/:hostel_id")
  getRoomsByHostel(@Param("hostel_id") hostel_id: string) {
    return this.hostelRoomService.getHostelRoomsByHostelId(+hostel_id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.hostelRoomService.getHostelRoomById(+id);
  }

  @Put("update/:id")
  @ApiBody({ type: HostelRoomDto })
  update(@Param("id") id: string, @Body() data: Partial<HostelRoomDto>) {
    return this.hostelRoomService.updateHostelRoom(+id, data);
  }

  @Delete("delete/:id")
  remove(@Param("id") id: string) {
    return this.hostelRoomService.deleteHostelRoom(+id);
  }
}
