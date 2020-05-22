import * as getters from '../getters';

describe('Vuex', () => {
  describe('workers module', () => {
    describe('getters', () => {
      describe('workers', () => {
        it('should return array of workers', () => {
          const workers = ['worker 1', 'worker 2'];
          const state = { workers };

          expect(getters.workers(state)).toEqual(workers);
        });
      });

      describe('isSingleManTeam', () => {
        it('should return whether array of workers contains only current user', () => {
          const cases = [
            { workers: [{ id: '1' }, { id: '2' }], user: { id: '1' }, expected: false },
            { workers: [{ id: '2' }], user: { id: '1' }, expected: false },
            { workers: [{ id: '1' }], user: { id: '1' }, expected: true },
          ];

          cases.forEach(({ workers, user, expected }) => {
            const result = getters.isSingleManTeam({}, { workers }, { user });
            expect(result).toEqual(expected);
          });
        });
      });

      describe('personalProfile', () => {
        it('should return personalProfile prop', () => {
          const personalProfile = 'personalProfile attr';
          const state = { personalProfile };

          expect(getters.personalProfile(state)).toEqual(personalProfile);
        });
      });
    });
  });
});
