const Endpoints = {
    Login: 'admin/login',
    FetchRoom: 'rooms/all',
    FetchDepartmentService: 'rooms/all/service',
    AddService: 'rooms/add/service',
    UpdateService: 'rooms/update/service',
    AddRoom: 'rooms/add',
    DeleteRoom: 'rooms/delete',
    UpdateRoom: 'rooms/update',
    AddGuest: 'guests/add',
    DeleteGuest: 'guests/delete',
    UpdateGuest: 'guests/update',
    FetchGuest: 'guests/all',
    FetchReservation: 'reservations/all',
    AddReservation: 'reservations/add',
    UpdateReservation: 'reservations/update',
    FetchTransaction: 'transaction/all',
    AddTransaction: 'transaction/add',
    CheckOutTransaction: 'transaction/checkOut',
    UpdateTransaction: 'transaction/update',
    DeleteService: 'rooms/delete/service',
}

export { Endpoints }