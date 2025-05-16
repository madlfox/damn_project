
import { BASE_URL } from '../index.js';
import { updateTextForElem } from '../utils/languages.js';
import { formatDate, formatSeconds } from '../utils/date.js';
import { isUserConnected } from "../utils/utils.js";

import { navigateTo } from '../index.js';

// Function that will be called when the view is loaded
export async function pongStatistics(): Promise<void> {
	if (!(await isUserConnected())) {
		navigateTo('/signin');
		return;
	}

	// Select elements
	const pvpBtn = document.getElementById('pvp-stat-btn') as HTMLElement;
	const aiBtn = document.getElementById('ai-stat-btn') as HTMLElement;
	const tournamentBtn = document.getElementById('tournament-stat-btn') as HTMLElement;

	const statTable = document.getElementById('pong-stat-table') as HTMLTableElement;
	const globalStatTable = document.getElementById('pong-global-stat-table') as HTMLTableElement;

	// Fill global stats table
	const fillGlobalStatTable = async (): Promise<void> => {
		globalStatTable.innerHTML = '';

		// Create the table headers
		const thead = document.createElement('thead');
		const tr = document.createElement('tr');
		const columns = ['total games', 'total duration'];

		columns.forEach(column => {
			const th = document.createElement('th');
			th.setAttribute('data-translate', column);
			updateTextForElem(th, column);
			tr.appendChild(th);
		});

		thead.appendChild(tr);
		globalStatTable.appendChild(thead);

		// Create the table body
		const tbody = document.createElement('tbody');
		globalStatTable.appendChild(tbody);

		try {
			const response = await fetch(`${BASE_URL}/api/pong_stats/`);
			if (response.ok) {
				const responseData: { [key: string]: number } = await response.json();
				const tr = document.createElement('tr');
				const dataColumns = ['total_pong_matches', 'total_pong_time'];

				dataColumns.forEach(column => {
					const td = document.createElement('td');
					td.textContent = column === 'total_pong_time'
						? formatSeconds(responseData[column])
						: responseData[column]?.toString() ?? '0';
					tr.appendChild(td);
				});
				tbody.appendChild(tr);
			}
		} catch (error) {
			console.error('Error fetching global pong stats:', error);
		}
	};

	// Helper to create table headers
	const createTableHeaders = (columns: string[], table: HTMLTableElement) => {
		const thead = document.createElement('thead');
		const tr = document.createElement('tr');
		columns.forEach(column => {
			const th = document.createElement('th');
			th.setAttribute('data-translate', column);
			updateTextForElem(th, column);
			tr.appendChild(th);
		});
		thead.appendChild(tr);
		table.appendChild(thead);
	};

	// Helper to clear and create tbody
	const clearTableBody = (table: HTMLTableElement): HTMLTableSectionElement => {
		table.innerHTML = '';
		const tbody = document.createElement('tbody');
		table.appendChild(tbody);
		return tbody;
	};

	// Fill PvP stats
	const fillPvpTable = async (): Promise<void> => {
		const tbody = clearTableBody(statTable);
		createTableHeaders(['db date', 'db player 1', 'db player 2', 'db score', 'db winner', 'db duration'], statTable);

		try {
			const response = await fetch(`${BASE_URL}/api/PvPong_match_history/`);
			if (response.ok) {
				const stats: any[] = await response.json();

				if (stats.length === 0) {
					const tr = document.createElement('tr');
					const td = document.createElement('td');
					td.colSpan = 6;
					td.setAttribute('data-translate', 'no stats');
					updateTextForElem(td, 'no stats');
					tr.appendChild(td);
					tbody.appendChild(tr);
					return;
				}

				stats.forEach(stat => {
					const tr = document.createElement('tr');
					const columns = ['match_date', 'player_one', 'player_two', 'match_score', 'winner', 'match_duration'];
					columns.forEach(column => {
						const td = document.createElement('td');
						td.textContent = column === 'match_date'
							? formatDate(stat[column])
							: column === 'match_duration'
								? stat[column]?.substring(3) ?? ''
								: stat[column]?.toString() ?? '';
						tr.appendChild(td);
					});
					tbody.appendChild(tr);
				});
			}
		} catch (error) {
			console.error('Error fetching PvP stats:', error);
		}
	};

	// Fill AI stats
	const fillAiTable = async (): Promise<void> => {
		const tbody = clearTableBody(statTable);
		createTableHeaders(['db date', 'db player', 'db ai lvl', 'db score', 'db winner', 'db duration'], statTable);

		try {
			const response = await fetch(`${BASE_URL}/api/AIpong_match_history/`);
			if (response.ok) {
				const stats: any[] = await response.json();

				if (stats.length === 0) {
					const tr = document.createElement('tr');
					const td = document.createElement('td');
					td.colSpan = 6;
					td.setAttribute('data-translate', 'no stats');
					updateTextForElem(td, 'no stats');
					tr.appendChild(td);
					tbody.appendChild(tr);
					return;
				}

				stats.forEach(stat => {
					const tr = document.createElement('tr');
					const columns = ['match_date', 'player_one', 'ai_level', 'match_score', 'winner', 'match_duration'];
					columns.forEach(column => {
						const td = document.createElement('td');
						td.textContent = column === 'match_date'
							? formatDate(stat[column])
							: column === 'match_duration'
								? stat[column]?.substring(3) ?? ''
								: stat[column]?.toString() ?? '';
						tr.appendChild(td);
					});
					tbody.appendChild(tr);
				});
			}
		} catch (error) {
			console.error('Error fetching AI stats:', error);
		}
	};

	// Fill Tournament stats
	const fillTournamentTable = async (): Promise<void> => {
		const tbody = clearTableBody(statTable);
		createTableHeaders(['db date', 'db player 1', 'db player 2', 'db player 3', 'db player 4', 'db winner', 'db duration'], statTable);

		try {
			const response = await fetch(`${BASE_URL}/api/tournament_history/`);
			if (response.ok) {
				const stats: any[] = await response.json();

				if (stats.length === 0) {
					const tr = document.createElement('tr');
					const td = document.createElement('td');
					td.colSpan = 7;
					td.setAttribute('data-translate', 'no stats');
					updateTextForElem(td, 'no stats');
					tr.appendChild(td);
					tbody.appendChild(tr);
					return;
				}

				stats.forEach(stat => {
					const tr = document.createElement('tr');
					const columns = ['date', 'player_one', 'player_two', 'player_three', 'player_four', 'winner', 'duration'];
					columns.forEach(column => {
						const td = document.createElement('td');
						td.textContent = column === 'date'
							? formatDate(stat[column])
							: column === 'duration'
								? stat[column]?.substring(3) ?? ''
								: stat[column]?.toString() ?? '';
						tr.appendChild(td);
					});
					tbody.appendChild(tr);
				});
			}
		} catch (error) {
			console.error('Error fetching tournament stats:', error);
		}
	};

	// Default setup
	pvpBtn.classList.add('selected');
	pvpBtn.setAttribute('aria-pressed', 'true');
	await fillPvpTable();
	await fillGlobalStatTable();

	// Event listeners
	pvpBtn.addEventListener('click', async () => {
		pvpBtn.classList.add('selected');
		pvpBtn.setAttribute('aria-pressed', 'true');
		aiBtn.classList.remove('selected');
		aiBtn.setAttribute('aria-pressed', 'false');
		tournamentBtn.classList.remove('selected');
		tournamentBtn.setAttribute('aria-pressed', 'false');
		await fillPvpTable();
	});

	aiBtn.addEventListener('click', async () => {
		aiBtn.classList.add('selected');
		aiBtn.setAttribute('aria-pressed', 'true');
		pvpBtn.classList.remove('selected');
		pvpBtn.setAttribute('aria-pressed', 'false');
		tournamentBtn.classList.remove('selected');
		tournamentBtn.setAttribute('aria-pressed', 'false');
		await fillAiTable();
	});

	tournamentBtn.addEventListener('click', async () => {
		tournamentBtn.classList.add('selected');
		tournamentBtn.setAttribute('aria-pressed', 'true');
		pvpBtn.classList.remove('selected');
		pvpBtn.setAttribute('aria-pressed', 'false');
		aiBtn.classList.remove('selected');
		aiBtn.setAttribute('aria-pressed', 'false');
		await fillTournamentTable();
	});
}
