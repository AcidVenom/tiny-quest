/**
* @class StateManager
* @brief The state manager used for switching states
* @author Daniël Konings
*/
var StateManager = StateManager ||
{
	/// The current state
	_currentState: undefined,

	/// Switches the current state to a new state, destroying the current one
	switchState: function(state)
	{
		MouseEventManager.clear();
		
		if (state.name === undefined)
		{
			Log.error("[StateManager] State does not have a name!");
		}
		else if (state.initialise === undefined)
		{
			assert("[StateManager] State does not have an initialise function!");
		}
		else if (state.destroy === undefined)
		{
			assert("[StateManager] State does not have a destroy function!");
		}
		else
		{
			if (this._currentState !== undefined)
			{
				this._currentState.destroy();
				Log.info("[StateManager] Destroyed the state '" + this._currentState.name + "'");
			}

			state.initialise();
			Log.info("[StateManager] Initialised the state '" + state.name + "'");

			this._currentState = state;

			if (this._currentState.name !== undefined)
			{
				Log.debug("[StateManager] Switched to state '" + this._currentState.name + "'");
			}
			else
			{
				Log.debug("[StateManager] Switched to a state with no name");
			}
		}

		Game.cleanUp();
	},

	/// Returns the current state
	getState: function()
	{
		return this._currentState;
	},

	update: function(dt)
	{
		if (this._currentState == undefined)
			return;

		if (this._currentState.update !== undefined)
		{
			this._currentState.update(dt);
		}
	},

	draw: function(dt)
	{
		if (this._currentState == undefined)
			return;

		if (this._currentState.draw !== undefined)
		{
			this._currentState.draw(dt);
		}
	},

	reload: function()
	{
		MouseEventManager.clear();
		Broadcaster.clear();

		if (this._currentState == undefined)
			return;
		
		if (this._currentState.reload !== undefined)
		{
			this._currentState.reload()
		}

		Game.cleanUp();

		Log.success("[StateManager] Succesfully reloaded");
	}
}