import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockCourses = [
  {
    id: 1,
    title: 'Робототехника для начинающих',
    age: '7-10 лет',
    schedule: 'ПН, СР 16:00-17:30',
    price: '3500 ₽/месяц',
    spots: 8,
    totalSpots: 12,
    image: '🤖',
    description: 'Изучаем основы робототехники и программирования',
    teacher: 'Иванов Петр',
    duration: '1.5 часа',
    room: 'Кабинет 201'
  },
  {
    id: 2,
    title: 'Рисование и творчество',
    age: '5-8 лет',
    schedule: 'ВТ, ЧТ 15:00-16:00',
    price: '2800 ₽/месяц',
    spots: 3,
    totalSpots: 10,
    image: '🎨',
    description: 'Развиваем творческие способности через искусство',
    teacher: 'Смирнова Анна',
    duration: '1 час',
    room: 'Кабинет 105'
  },
  {
    id: 3,
    title: 'Шахматы для детей',
    age: '6-12 лет',
    schedule: 'ПН, ПТ 17:00-18:00',
    price: '3000 ₽/месяц',
    spots: 5,
    totalSpots: 15,
    image: '♟️',
    description: 'Развиваем логическое мышление и стратегию',
    teacher: 'Козлов Дмитрий',
    duration: '1 час',
    room: 'Кабинет 302'
  },
  {
    id: 4,
    title: 'Английский язык',
    age: '8-12 лет',
    schedule: 'ВТ, ЧТ 16:30-18:00',
    price: '4000 ₽/месяц',
    spots: 2,
    totalSpots: 8,
    image: '🇬🇧',
    description: 'Изучаем английский в игровой форме',
    teacher: 'Петрова Елена',
    duration: '1.5 часа',
    room: 'Кабинет 203'
  },
  {
    id: 5,
    title: 'Танцы и хореография',
    age: '5-10 лет',
    schedule: 'СР, ПТ 15:00-16:30',
    price: '3200 ₽/месяц',
    spots: 4,
    totalSpots: 12,
    image: '💃',
    description: 'Развиваем пластику и координацию движений',
    teacher: 'Новикова Мария',
    duration: '1.5 часа',
    room: 'Зал 1'
  },
  {
    id: 6,
    title: 'Программирование Scratch',
    age: '8-11 лет',
    schedule: 'ПН, СР 17:30-19:00',
    price: '3800 ₽/месяц',
    spots: 6,
    totalSpots: 10,
    image: '💻',
    description: 'Создаем игры и анимации в Scratch',
    teacher: 'Иванов Петр',
    duration: '1.5 часа',
    room: 'Кабинет 201'
  }
];

export default function Index() {
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedTime, setSelectedTime] = useState<string>('all');
  const [userRole, setUserRole] = useState<'guest' | 'parent' | 'teacher' | 'admin'>('guest');

  const filteredCourses = mockCourses.filter(course => {
    const ageMatch = selectedAge === 'all' || course.age.includes(selectedAge);
    const timeMatch = selectedTime === 'all' || course.schedule.includes(selectedTime);
    return ageMatch && timeMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-orange-50 to-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-4xl">🚀</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Детский Центр
            </h1>
          </div>
          <nav className="flex gap-4 items-center">
            <Button variant="ghost" onClick={() => setUserRole('guest')}>Курсы</Button>
            <Button variant="ghost" onClick={() => setUserRole('parent')}>Личный кабинет</Button>
            <Button variant="ghost" onClick={() => setUserRole('teacher')}>Для педагогов</Button>
            <Button variant="ghost" onClick={() => setUserRole('admin')}>Администратор</Button>
          </nav>
        </div>
      </header>

      {userRole === 'guest' && (
        <>
          <section className="container mx-auto px-4 py-16 text-center animate-fade-in">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Развиваем таланты вашего ребенка!
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Более 15 курсов для детей от 5 до 12 лет. Опытные педагоги, современное оборудование и индивидуальный подход к каждому ученику.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="text-lg">
                <Icon name="BookOpen" className="mr-2" size={20} />
                Выбрать курс
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                <Icon name="Phone" className="mr-2" size={20} />
                Связаться с нами
              </Button>
            </div>
          </section>

          <section className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center hover:shadow-lg transition-shadow animate-slide-up">
                <CardHeader>
                  <div className="text-5xl mb-4">👨‍🏫</div>
                  <CardTitle>Опытные педагоги</CardTitle>
                  <CardDescription>Все преподаватели с высшим образованием и опытом работы более 5 лет</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow animate-slide-up" style={{animationDelay: '0.1s'}}>
                <CardHeader>
                  <div className="text-5xl mb-4">🏆</div>
                  <CardTitle>Индивидуальный подход</CardTitle>
                  <CardDescription>Малые группы до 12 человек позволяют уделить внимание каждому ребенку</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow animate-slide-up" style={{animationDelay: '0.2s'}}>
                <CardHeader>
                  <div className="text-5xl mb-4">📱</div>
                  <CardTitle>Удобная система</CardTitle>
                  <CardDescription>Отслеживайте посещаемость, успехи и баланс в личном кабинете</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-6 text-center">Каталог курсов</h3>
              <div className="flex gap-4 justify-center flex-wrap mb-6">
                <Select value={selectedAge} onValueChange={setSelectedAge}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Возраст" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все возрасты</SelectItem>
                    <SelectItem value="5">5-6 лет</SelectItem>
                    <SelectItem value="7">7-8 лет</SelectItem>
                    <SelectItem value="9">9-10 лет</SelectItem>
                    <SelectItem value="11">11-12 лет</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="День недели" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все дни</SelectItem>
                    <SelectItem value="ПН">Понедельник</SelectItem>
                    <SelectItem value="ВТ">Вторник</SelectItem>
                    <SelectItem value="СР">Среда</SelectItem>
                    <SelectItem value="ЧТ">Четверг</SelectItem>
                    <SelectItem value="ПТ">Пятница</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <Card key={course.id} className="hover:shadow-xl transition-all hover:-translate-y-1 animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardHeader>
                    <div className="text-6xl mb-4 text-center">{course.image}</div>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon name="Users" size={16} className="text-primary" />
                      <span className="text-sm">{course.age}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" size={16} className="text-secondary" />
                      <span className="text-sm">{course.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" size={16} className="text-accent" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={16} className="text-muted-foreground" />
                      <span className="text-sm">{course.room}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="User" size={16} className="text-muted-foreground" />
                      <span className="text-sm">{course.teacher}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-primary">{course.price}</span>
                      <Badge variant={course.spots > 5 ? "default" : "destructive"}>
                        {course.spots} мест
                      </Badge>
                    </div>
                    <Button className="w-full" size="lg">
                      <Icon name="UserPlus" className="mr-2" size={18} />
                      Записаться
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}

      {userRole === 'parent' && (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6">Личный кабинет ученика</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="User" size={20} />
                  Профиль
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Имя:</strong> Иван Петров</p>
                <p><strong>Возраст:</strong> 9 лет</p>
                <p><strong>Родитель:</strong> Петрова Мария</p>
                <p><strong>Телефон:</strong> +7 (999) 123-45-67</p>
                <Button variant="outline" className="w-full mt-4">
                  <Icon name="Edit" className="mr-2" size={16} />
                  Редактировать
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Wallet" size={20} />
                  Баланс
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">8 занятий</div>
                <p className="text-sm text-muted-foreground mb-4">Оплачено до 15 марта 2024</p>
                <Button className="w-full">
                  <Icon name="CreditCard" className="mr-2" size={16} />
                  Пополнить баланс
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BookOpen" size={20} />
                  Активные курсы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge className="w-full justify-start py-2">🤖 Робототехника</Badge>
                <Badge className="w-full justify-start py-2">💻 Программирование</Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Расписание и посещаемость</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: '4 марта (ПН)', course: 'Робототехника', status: 'present', time: '16:00-17:30' },
                  { date: '5 марта (ВТ)', course: 'Программирование', status: 'present', time: '17:30-19:00' },
                  { date: '6 марта (СР)', course: 'Робототехника', status: 'absent', time: '16:00-17:30', reason: 'Болезнь (справка)' },
                  { date: '8 марта (ПТ)', course: 'Программирование', status: 'upcoming', time: '17:30-19:00' }
                ].map((lesson, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{lesson.date} - {lesson.course}</p>
                      <p className="text-sm text-muted-foreground">{lesson.time}</p>
                      {lesson.reason && <p className="text-sm text-amber-600">{lesson.reason}</p>}
                    </div>
                    {lesson.status === 'present' && (
                      <Badge variant="default" className="bg-green-500">
                        <Icon name="Check" size={14} className="mr-1" />
                        Присутствовал
                      </Badge>
                    )}
                    {lesson.status === 'absent' && (
                      <Badge variant="destructive">
                        <Icon name="X" size={14} className="mr-1" />
                        Отсутствовал
                      </Badge>
                    )}
                    {lesson.status === 'upcoming' && (
                      <Badge variant="outline">
                        <Icon name="Clock" size={14} className="mr-1" />
                        Предстоит
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {userRole === 'teacher' && (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6">Кабинет педагога</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BookOpen" size={20} />
                  Мои курсы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">2 курса</div>
                <p className="text-sm text-muted-foreground">Робототехника, Программирование</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Users" size={20} />
                  Учеников
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary mb-2">18 человек</div>
                <p className="text-sm text-muted-foreground">Всего в группах</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Wallet" size={20} />
                  Зарплата (март)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent mb-2">45,000 ₽</div>
                <p className="text-sm text-muted-foreground">За 12 проведенных занятий</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Расписание занятий</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: 'ПН 4 марта', course: 'Робототехника', lesson: 'Урок 8', time: '16:00-17:30', students: 10 },
                  { date: 'СР 6 марта', course: 'Робототехника', lesson: 'Урок 9', time: '16:00-17:30', students: 10 },
                  { date: 'СР 6 марта', course: 'Программирование', lesson: 'Урок 12', time: '17:30-19:00', students: 8 }
                ].map((lesson, idx) => (
                  <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-lg">{lesson.course} - {lesson.lesson}</p>
                        <p className="text-sm text-muted-foreground">{lesson.date} • {lesson.time}</p>
                      </div>
                      <Badge>{lesson.students} учеников</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Icon name="ClipboardList" className="mr-2" size={14} />
                        Посещаемость
                      </Button>
                      <Button size="sm" variant="outline">
                        <Icon name="FileText" className="mr-2" size={14} />
                        План урока
                      </Button>
                      <Button size="sm" variant="outline">
                        <Icon name="MessageSquare" className="mr-2" size={14} />
                        Сообщения
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Список учеников</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: 'Иван Петров', course: 'Робототехника', paid: true, attendance: '95%' },
                  { name: 'Анна Смирнова', course: 'Робототехника', paid: true, attendance: '88%' },
                  { name: 'Дмитрий Козлов', course: 'Программирование', paid: false, attendance: '100%' }
                ].map((student, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.course}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge variant={student.paid ? "default" : "destructive"}>
                        {student.paid ? 'Оплачено' : 'Не оплачено'}
                      </Badge>
                      <span className="text-sm">{student.attendance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {userRole === 'admin' && (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6">Панель администратора</h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon name="BookOpen" size={18} />
                  Курсы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">6</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon name="Users" size={18} />
                  Учеников
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">64</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon name="GraduationCap" size={18} />
                  Педагогов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">5</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon name="DollarSign" size={18} />
                  Доход (март)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">224,000 ₽</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="courses">Курсы</TabsTrigger>
              <TabsTrigger value="students">Ученики</TabsTrigger>
              <TabsTrigger value="teachers">Педагоги</TabsTrigger>
              <TabsTrigger value="finance">Финансы</TabsTrigger>
            </TabsList>

            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Управление курсами</CardTitle>
                    <Button>
                      <Icon name="Plus" className="mr-2" size={16} />
                      Добавить курс
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCourses.slice(0, 3).map((course) => (
                      <div key={course.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">{course.title}</p>
                          <p className="text-sm text-muted-foreground">{course.teacher} • {course.schedule}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Icon name="Edit" size={14} />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Список учеников</CardTitle>
                    <Button>
                      <Icon name="UserPlus" className="mr-2" size={16} />
                      Добавить ученика
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Иван Петров', courses: 2, balance: 8, parent: 'Петрова М.', phone: '+7 999 123-45-67' },
                      { name: 'Анна Смирнова', courses: 1, balance: 4, parent: 'Смирнов А.', phone: '+7 999 234-56-78' },
                      { name: 'Дмитрий Козлов', courses: 2, balance: 0, parent: 'Козлова Е.', phone: '+7 999 345-67-89' }
                    ].map((student, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.parent} • {student.phone}</p>
                        </div>
                        <div className="flex gap-4 items-center">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Курсов</p>
                            <p className="font-semibold">{student.courses}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Баланс</p>
                            <p className={`font-semibold ${student.balance === 0 ? 'text-red-500' : 'text-green-500'}`}>
                              {student.balance} занятий
                            </p>
                          </div>
                          <Button size="sm" variant="outline">Профиль</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teachers">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Педагоги</CardTitle>
                    <Button>
                      <Icon name="UserPlus" className="mr-2" size={16} />
                      Добавить педагога
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Иванов Петр', courses: ['Робототехника', 'Программирование'], rate: 350, salary: 45000 },
                      { name: 'Смирнова Анна', courses: ['Рисование'], rate: 300, salary: 28000 },
                      { name: 'Козлов Дмитрий', courses: ['Шахматы'], rate: 280, salary: 32000 }
                    ].map((teacher, idx) => (
                      <div key={idx} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{teacher.name}</p>
                            <p className="text-sm text-muted-foreground">{teacher.courses.join(', ')}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Icon name="Settings" size={14} />
                          </Button>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="text-muted-foreground">Тариф: </span>
                            <span className="font-semibold">{teacher.rate} ₽/ученик</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Зарплата (март): </span>
                            <span className="font-semibold text-green-600">{teacher.salary.toLocaleString()} ₽</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="finance">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Доходы (март 2024)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { course: 'Робототехника', amount: 70000, students: 10 },
                      { course: 'Программирование', amount: 60800, students: 8 },
                      { course: 'Рисование', amount: 28000, students: 10 },
                      { course: 'Шахматы', amount: 45000, students: 15 },
                      { course: 'Английский', amount: 32000, students: 8 }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{item.course}</p>
                          <p className="text-sm text-muted-foreground">{item.students} учеников</p>
                        </div>
                        <p className="font-bold text-green-600">{item.amount.toLocaleString()} ₽</p>
                      </div>
                    ))}
                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-lg">Итого:</p>
                        <p className="font-bold text-2xl text-green-600">235,800 ₽</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Расходы (март 2024)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { item: 'Зарплата педагогов', amount: 145000 },
                      { item: 'Аренда помещения', amount: 50000 },
                      { item: 'Оборудование и материалы', amount: 15000 },
                      { item: 'Коммунальные услуги', amount: 8000 },
                      { item: 'Прочие расходы', amount: 7000 }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <p className="font-semibold">{item.item}</p>
                        <p className="font-bold text-red-600">{item.amount.toLocaleString()} ₽</p>
                      </div>
                    ))}
                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-lg">Итого расходы:</p>
                        <p className="font-bold text-2xl text-red-600">225,000 ₽</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="font-bold text-lg">Прибыль:</p>
                        <p className="font-bold text-2xl text-green-600">10,800 ₽</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      <footer className="bg-gray-900 text-white mt-16 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-3xl">🚀</span>
                Детский Центр
              </h4>
              <p className="text-gray-400">Развиваем таланты вашего ребенка с 2015 года</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Контакты</h4>
              <p className="text-gray-400 mb-2">📍 г. Москва, ул. Примерная, д. 123</p>
              <p className="text-gray-400 mb-2">📞 +7 (495) 123-45-67</p>
              <p className="text-gray-400">✉️ info@detcentr.ru</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Часы работы</h4>
              <p className="text-gray-400 mb-2">Пн-Пт: 14:00 - 20:00</p>
              <p className="text-gray-400 mb-2">Сб: 10:00 - 18:00</p>
              <p className="text-gray-400">Вс: выходной</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Детский Центр. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
