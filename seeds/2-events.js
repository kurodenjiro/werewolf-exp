
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
        // Inserts seed entries
        knex('events').insert({
          id: 1, 
          title: '法拉盛面杀网公开活动',
          type: 'A', 
          date: '8 March, 2017 下午 3:00', 
          currentFill: '1', 
          capacity: 12,
          address: '13631 41st Avenue, Flushing, NY, United States',
          note: '小姐姐速来！！！',
          user_id: '1',
          user_nickname: '九记牛',
          participants: '九记牛',
          participantsID: '12323',
          clickCount: '19',
          filePath: 'images/eventFile-1488595504040.jpg',
          host_profile: 'profilePic/default.jpg',
          is_available: '1',
          admission: 'Free'
        })
      ]);
};
