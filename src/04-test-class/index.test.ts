import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';
import _ from 'lodash';

describe('BankAccount', () => {
  const initialBalance = 10;
  let account!: BankAccount; // filled on beforeEach

  beforeEach(() => {
    account = getBankAccount(initialBalance);
  });

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(20)).toThrowError(
      new InsufficientFundsError(initialBalance),
    );
  });

  test('should throw error when transferring more than balance', () => {
    const targetAccount = getBankAccount(initialBalance);

    expect(() => account.transfer(20, targetAccount)).toThrowError(
      new InsufficientFundsError(initialBalance),
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(20, account)).toThrowError(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    account.deposit(20);

    expect(account.getBalance()).toBe(30);
  });

  test('should withdraw money', () => {
    account.withdraw(2);

    expect(account.getBalance()).toBe(8);
  });

  test('should transfer money', () => {
    const targetAccount = getBankAccount(initialBalance);

    account.transfer(2, targetAccount);

    expect(account.getBalance()).toBe(8);
    expect(targetAccount.getBalance()).toBe(12);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const mockedFetchedBalance = 20;
    jest
      .spyOn(_, 'random')
      .mockReturnValueOnce(mockedFetchedBalance /* generate balance */)
      .mockReturnValueOnce(1 /* generate request result */);

    const fetchedBalance = await account.fetchBalance();

    expect(fetchedBalance).toBe(mockedFetchedBalance);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const mockedFetchedBalance = 20;

    jest
      .spyOn(_, 'random')
      .mockReturnValueOnce(mockedFetchedBalance /* generate balance */)
      .mockReturnValueOnce(1 /* generate request result */);

    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(mockedFetchedBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest //
      .spyOn(_, 'random')
      .mockReturnValueOnce(1000 /* generate balance */)
      .mockReturnValueOnce(0 /* generate request result */);

    await expect(account.synchronizeBalance()).rejects.toThrowError(
      SynchronizationFailedError,
    );
  });
});
