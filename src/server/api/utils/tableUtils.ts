export type RawData = {
  id: string;
  costs: string;
  createdAt: Date;
  hours: string;
  user: { name: string; id: string };
};

export type TableData = {
  id: string;
  costs: string;
  createdAt: Date;
  hours: string;
  name: string;
};

export type DataMappedToDay = {
  monday: TableData[];
  tuesday: TableData[];
  wednesday: TableData[];
  thursday: TableData[];
  friday: TableData[];
  saturday: TableData[];
  sunday: TableData[];
};

export type ComputedDailyData = {
  Monday: TableData[];
  Tuesday: TableData[];
  Wednesday: TableData[];
  Thursday: TableData[];
  Friday: TableData[];
  Saturday: TableData[];
  Sunday: TableData[];
};

export type UserCosts = Record<
  string,
  {
    costs: number;
  }
>;

export type UserHours = Record<
  string,
  {
    hours: number;
  }
>;

export type WeeklyMappedData = {
  weeklyData: ComputedDailyData;
  overallCosts: UserCosts;
  overallHours: UserHours;
};

export const sortDataByWeek = (postData: TableData[], previousDays: Date) => {
  const first: TableData[] = [];
  const second: TableData[] = [];

  postData.forEach((post) => {
    const objDate = new Date(post.createdAt);

    if (objDate < previousDays) {
      first.push(post);
    } else {
      second.push(post);
    }
  });

  return [first, second];
};

export const sortDataByDay = (data: TableData[]): DataMappedToDay => {
  //Mon: 1, Tues: 2, Wed: 3, Thur: 4, Fri: 5, Sat: 6, Sun: 0
  const dayGroups: DataMappedToDay = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };

  for (const post of data) {
    const postDay = new Date(post.createdAt).getDay();

    switch (postDay) {
      case 0:
        dayGroups.sunday.push(post);
        break;

      case 1:
        dayGroups.monday.push(post);
        break;

      case 2:
        dayGroups.tuesday.push(post);
        break;

      case 3:
        dayGroups.wednesday.push(post);
        break;

      case 4:
        dayGroups.thursday.push(post);
        break;

      case 5:
        dayGroups.friday.push(post);
        break;

      case 6:
        dayGroups.saturday.push(post);
        break;

      default:
        throw new Error(
          "A number that is not a day was given to the tableData switch",
        );
    }
  }

  return dayGroups;
};

export const addValuesTogether = (postValues: TableData[]): TableData[] => {
  const duplicatePosts = postValues.map((element) => {
    const matchingElements = postValues.filter(
      (el) => el.name === element.name,
    );

    const totalCost = matchingElements.reduce((acc, el) => acc + +el.costs, 0);

    const totalHours = matchingElements.reduce((acc, el) => acc + +el.hours, 0);

    return {
      id: element.id,
      name: element.name,
      createdAt: element.createdAt,
      costs: totalCost.toString(),
      hours: totalHours.toString(),
    };
  });

  //remove duplicates created by above algo
  return duplicatePosts.filter(
    (post, index) =>
      duplicatePosts.findIndex((item) => item.name === post.name) === index,
  );
};

export const addDailyUserEntriesTogether = (
  data: DataMappedToDay,
): ComputedDailyData => {
  return {
    Monday: addValuesTogether(data.monday),
    Tuesday: addValuesTogether(data.tuesday),
    Wednesday: addValuesTogether(data.wednesday),
    Thursday: addValuesTogether(data.thursday),
    Friday: addValuesTogether(data.friday),
    Saturday: addValuesTogether(data.saturday),
    Sunday: addValuesTogether(data.sunday),
  };
};

export const addUpHowMuchUserSpent = (data: TableData[]): UserCosts => {
  const finalSums: UserCosts = {};

  for (const post of data) {
    if (!post.name) {
      throw new Error("No name on post when adding up costs");
    }

    const builtCosts = {
      name: post.name,
      costs: post.costs === "" || !post.costs ? "0" : post.costs,
    };

    if (!finalSums[builtCosts.name]) {
      finalSums[builtCosts.name] = { costs: +builtCosts.costs };
    } else {
      finalSums[builtCosts.name]!.costs =
        +finalSums[builtCosts.name]!.costs + +builtCosts.costs;
    }
  }

  return finalSums;
};

export const addUpHowManyHoursWorked = (data: TableData[]): UserHours => {
  const finalSums: UserHours = {};

  for (const post of data) {
    if (!post.name) {
      throw new Error("No name on post when adding up costs");
    }

    const talliedHours = {
      name: post.name,
      hours: post.hours === "" || !post.hours ? "0" : post.hours,
    };

    if (!finalSums[talliedHours.name]) {
      finalSums[talliedHours.name] = { hours: +talliedHours.hours };
    } else {
      finalSums[talliedHours.name]!.hours =
        +finalSums[talliedHours.name]!.hours + +talliedHours.hours;
    }
  }

  return finalSums;
};

export const flattenObject = (posts: RawData[]): TableData[] => {
  return posts.map((post) => ({
    id: post.id,
    costs: post.costs,
    createdAt: post.createdAt,
    hours: post.hours,
    name: post.user.name,
  }));
};

export const mapTableData = (
  postData: RawData[],
  previousDays: Date,
): WeeklyMappedData[] => {
  const flattenedPostData = flattenObject(postData);

  const dataByWeek = sortDataByWeek(flattenedPostData, previousDays);

  return dataByWeek.map((oneWeeksData): WeeklyMappedData => {
    const dataByDay = sortDataByDay(oneWeeksData);

    const weeklyData = addDailyUserEntriesTogether(dataByDay);

    const overallCosts = addUpHowMuchUserSpent(oneWeeksData);

    const overallHours = addUpHowManyHoursWorked(oneWeeksData);

    return {
      weeklyData,
      overallCosts,
      overallHours,
    };
  });
};

export const subtractDaysFromWeek = (currentDay: Date) => {
  const daysToSubtract = (currentDay.getDay() + 6) % 7;

  const oneWeeksWorth = new Date(
    currentDay.getTime() - daysToSubtract * 24 * 60 * 60 * 1000,
  );
  oneWeeksWorth.setHours(11, 59, 59, 0);

  const previousDaysAndWeek = new Date(
    oneWeeksWorth.getTime() - 7 * 24 * 60 * 60 * 1000,
  );

  const previousDays = new Date(oneWeeksWorth.getTime() - 24 * 60 * 60 * 1000);

  return { previousDaysAndWeek, previousDays };
};
