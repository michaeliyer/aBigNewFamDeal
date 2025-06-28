import { LitElement, html, css } from "https://unpkg.com/lit@2/index.js?module";
import { myPeople } from "./myPeople.js";

class BirthdayPlus extends LitElement {
  static properties = {
    filters: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(
        135deg,
        #2c3e50 0%,
        #34495e 50%,
        #2c3e50 100%
      );
      font-family: "Poppins", "Segoe UI", "Roboto", "Helvetica Neue", Arial,
        sans-serif;
      color: #333;
      padding: 2rem 0;
    }

    .search-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2rem;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      padding: 1rem 1.5rem;
      align-items: center;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
      border: 2px solid rgba(255, 255, 255, 0.9);
    }
    input,
    select,
    button {
      padding: 0.5rem 0.7rem;
      font-size: 1.08rem;
      border-radius: 8px;
      border: 1px solid #ddd;
      background: #fefefe;
      transition: all 0.3s ease;
      font-family: "Poppins", sans-serif;
    }
    input:focus,
    select:focus {
      outline: none;
      border: 2px solid #e74c3c;
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
      background: #fff;
    }
    button {
      background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
      color: #fff;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(230, 126, 34, 0.4);
      background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
    }
    .person {
      margin-bottom: 1.5rem;
      padding: 1.2rem 1.5rem;
      border-radius: 12px;
      background: #ffffff;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
      font-size: 1.13rem;
      line-height: 1.6;
      border-left: 5px solid #27ae60;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.8);
    }
    .person:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      border-left-color: #f1c40f;
    }
    .person:nth-child(even) {
      border-left-color: #e74c3c;
    }
    .person:nth-child(even):hover {
      border-left-color: #e67e22;
    }
    .person strong {
      font-size: 1.22rem;
      color: #2c3e50;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .comment {
      margin-top: 0.5rem;
      color: #27ae60;
      font-style: italic;
      font-size: 1.05rem;
      word-break: break-word;
      background: linear-gradient(
        135deg,
        rgba(241, 196, 15, 0.1) 0%,
        rgba(39, 174, 96, 0.1) 100%
      );
      padding: 0.5rem;
      border-radius: 6px;
      border-left: 3px solid #f1c40f;
    }
    @media (max-width: 600px) {
      .search-bar,
      .person {
        padding: 1rem 0.5rem;
      }
    }
  `;

  constructor() {
    super();
    this.filters = {
      firstName: "",
      lastName: "",
      birthMonth: "",
      birthDay: "",
      birthYear: "",
      passedAway: false,
      group: "",
    };
  }

  updateFilter(field, value) {
    this.filters = { ...this.filters, [field]: value };
  }

  togglePassedAway(e) {
    this.filters = { ...this.filters, passedAway: e.target.checked };
  }

  get filteredPeople() {
    return myPeople
      .filter((p) => {
        const fn = this.filters.firstName.toLowerCase();
        const ln = this.filters.lastName.toLowerCase();
        const bm = this.filters.birthMonth.toLowerCase();
        const bd = this.filters.birthDay;
        const by = this.filters.birthYear;
        const grp = this.filters.group.toLowerCase();

        return (
          (!fn || p.firstName.toLowerCase().startsWith(fn)) &&
          (!ln || p.lastName.toLowerCase().startsWith(ln)) &&
          (!bm ||
            bm === "all months" ||
            (p.birthMonth && p.birthMonth.toLowerCase() === bm)) &&
          (!bd || p.birthDay == bd) &&
          (!by || p.birthYear == by) &&
          (!grp || (p.groups && p.groups.some((g) => g.toLowerCase() === grp)))
        );
      })
      .sort((a, b) => {
        const last = a.lastName.localeCompare(b.lastName);
        if (last !== 0) return last;
        return a.firstName.localeCompare(b.firstName);
      });
  }

  getMonthCounts() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const counts = {};
    let totalWithBirthdays = 0;

    months.forEach((month) => {
      counts[month] = myPeople.filter(
        (p) =>
          p.birthMonth && p.birthMonth.toLowerCase() === month.toLowerCase()
      ).length;
    });

    // Only count entries that have a valid month name
    totalWithBirthdays = myPeople.filter(
      (p) =>
        p.birthMonth &&
        months.some(
          (month) => month.toLowerCase() === p.birthMonth.toLowerCase()
        )
    ).length;

    return { counts, totalWithBirthdays };
  }

  getAvailableGroups() {
    const groups = [
      ...new Set(
        myPeople.flatMap((p) => p.groups).filter((g) => g && g !== null)
      ),
    ];
    return groups.sort();
  }

  getGroupCounts() {
    const counts = {};
    const groups = this.getAvailableGroups();
    groups.forEach((group) => {
      counts[group] = myPeople.filter(
        (p) => p.groups && p.groups.includes(group)
      ).length;
    });
    return counts;
  }

  clearFilters() {
    this.filters = {
      firstName: "",
      lastName: "",
      birthMonth: "",
      birthDay: "",
      birthYear: "",
      passedAway: false,
      group: "",
    };
    this.requestUpdate();
  }

  render() {
    // Determine if any filter is active (not empty or checked)
    const anyFilterActive = Object.entries(this.filters).some(
      ([key, value]) => {
        if (key === "passedAway") return value === true;
        return value && value !== "";
      }
    );
    return html`
      <div class="search-bar">
        <input
          placeholder="First Name"
          .value=${this.filters.firstName}
          @input=${(e) => this.updateFilter("firstName", e.target.value)}
        />
        <input
          placeholder="Last Name"
          .value=${this.filters.lastName}
          @input=${(e) => this.updateFilter("lastName", e.target.value)}
        />

        <select
          .value=${this.filters.birthMonth}
          @change=${(e) => this.updateFilter("birthMonth", e.target.value)}
        >
          <option value="">-- Month --</option>
          <option value="all months">
            All Months (${this.getMonthCounts().totalWithBirthdays})
          </option>
          ${[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month) => {
            const count = this.getMonthCounts().counts[month];
            return html`
              <option value=${month.toLowerCase()}>${month} (${count})</option>
            `;
          })}
        </select>

        <input
          type="number"
          placeholder="Day"
          .value=${this.filters.birthDay}
          @input=${(e) => this.updateFilter("birthDay", e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          .value=${this.filters.birthYear}
          @input=${(e) => this.updateFilter("birthYear", e.target.value)}
        />

        <select
          .value=${this.filters.group}
          @change=${(e) => this.updateFilter("group", e.target.value)}
        >
          <option value="">-- Group --</option>
          ${this.getAvailableGroups().map((group) => {
            const count = this.getGroupCounts()[group];
            return html` <option value=${group}>${group} (${count})</option> `;
          })}
        </select>

        <button @click=${this.clearFilters}>Clear</button>
      </div>

      ${anyFilterActive
        ? html`
            <div
              style="text-align: center; margin: 1rem 0; font-size: 1.1rem; color: #5a7bb0; font-weight: 500;"
            >
              Found ${this.filteredPeople.length}
              result${this.filteredPeople.length === 1 ? "" : "s"}
            </div>
            ${this.filteredPeople.length === 0
              ? html`<div>No results found.</div>`
              : ""}
            ${this.filteredPeople.map(
              (person) => html`
                <div class="person">
                  <strong>${person.firstName} ${person.lastName}</strong><br />
                  Born: ${person.birthMonth || "-"} ${person.birthDay || ""},
                  ${person.birthYear || "-"}<br />
                  ${person.passedAway
                    ? html`🕊️ Passed Away: ${person.passedAway} --- RIP
                        ${person.firstName}<br />`
                    : ""}
                  ${person.comment
                    ? html`<div class="comment">💬 ${person.comment}</div>`
                    : ""}
                </div>
              `
            )}
          `
        : ""}
    `;
  }
}

customElements.define("birthday-plus", BirthdayPlus);
