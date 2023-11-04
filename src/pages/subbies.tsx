import React, { type FormEvent, useState } from "react";
import { Button } from "~/components/Button";
import { Header } from "~/components/Header";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { api } from "~/utils/api";

const Subbies = () => {
  const [hoursValue, setHoursValue] = useState<string>();
  const [costsValue, setCostsValue] = useState<string>();
  const [subbieValue, setSubbieName] = useState<string>();

  const { data, isLoading, isError } = api.manageSubbies.getSubbies.useQuery(
    {},
  );

  const createEntry = api.subbie.createEntry.useMutation({
    onSuccess: () => {
      setHoursValue("");
      setCostsValue("");
      alert("Entry was submitted");
    },
    onError: (e) => {
      console.error(e);
      alert("There was a problem submitting");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log(hoursValue, costsValue, subbieValue);

    if (!hoursValue || !costsValue || !subbieValue) {
      alert("Select all inputs");
      return;
    }

    const postData = {
      hours: hoursValue,
      costs: costsValue,
      name: subbieValue,
    };

    createEntry.mutate(postData);
  };

  const subbieNamesPresent = data && data.subbies.length > 0;

  return (
    <>
      <Header />
      <div className="flex justify-center px-3 pt-8">
        {isError ? (
          <div className="flex justify-center py-5 text-gray-500">
            <p>There has been an error getting the Subbie names.</p>
          </div>
        ) : null}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <form className="w-full max-w-lg" onSubmit={handleSubmit}>
            <div className="rounded-lg border border-gray-200 px-3 py-6 shadow">
              <div className="mb-2 flex flex-wrap">
                <div className="w-full px-3 md:mb-0 md:w-1/2">
                  <label
                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                    htmlFor="grid-state"
                  >
                    Trade
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                      id="grid-state"
                      onChange={(e) => {
                        console.log("Subbbie", e.target.name);
                        setSubbieName(e.target.value);
                      }}
                    >
                      <option disabled selected className="text-gray-400">
                        Select a subbie.
                      </option>
                      {subbieNamesPresent ? (
                        data?.subbies.map((subbie) => {
                          return (
                            <option key={subbie.id} value={subbie.subbieName}>
                              {subbie.subbieName}
                            </option>
                          );
                        })
                      ) : (
                        <option>Please add a subbie in Manage</option>
                      )}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="h-4 w-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" mb-3 flex flex-wrap pt-3  ">
                <div className="mb-6 w-full px-3 md:mb-0 md:w-1/2">
                  <label
                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                    htmlFor="grid-first-name"
                  >
                    Costs
                  </label>
                  <input
                    className="block w-full appearance-none rounded border bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                    id="grid-first-name"
                    type="text"
                    placeholder="0.00"
                    value={costsValue}
                    onChange={(e) => setCostsValue(e.target.value)}
                  />
                </div>
                <div className="w-full px-3 md:w-1/2">
                  <label
                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                    htmlFor="grid-last-name"
                  >
                    Hours
                  </label>
                  <input
                    className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                    id="grid-last-name"
                    type="text"
                    placeholder="0"
                    value={hoursValue}
                    onChange={(e) => setHoursValue(e.target.value)}
                  />
                </div>
                <div className="px-3 pt-6">
                  {subbieNamesPresent ? (
                    <Button>Submit</Button>
                  ) : (
                    <Button disabled>Submit</Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
      <div className="px-5 pt-8 xl:px-32">
        <span className="text-xs text-gray-500">
          If you have contractors or subcontractors like chippies, builders,
          labourers etc. that arent part of your team, you can add their hours
          and costs here.
        </span>
      </div>
    </>
  );
};

export default Subbies;
